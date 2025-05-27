const { getDownloadURL, ref, uploadBytes } = require("firebase/storage");
const backgroundModel = require("../models/backgroundModel");
const storage = require("../infra/firebaseStorage");
const fs = require("fs").promises;

class BackgroundController {
  async search(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    const listBackgrounds = backgroundModel.list(limit, offset);
    try {
      const total = await backgroundModel.countAll();
      const bgs = await listBackgrounds;
      return res.status(200).json({ backgrounds: bgs, total: total[0].total_rows });
    } catch (error) {
      console.log("error = " + error);

      return res.status(400).json(error.message);
    }
  }

  getBackgroundById(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const listBackgroundById = backgroundModel.getById(id);
    return listBackgroundById
      .then((background) => {
        if (!background) {
          return res.status(404).json({ error: "Background não encontrado" });
        }
        res.status(200).json(background);
      })
      .catch((error) => res.status(400).json(error.message));
  }

  async getBgImage(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const background = await backgroundModel.getById(id);
      console.log(
        `getBgImage(${id}): background exists: ${!!background}, caminho: ${
          background?.caminho
        }`
      );
      if (!background || !background.caminho) {
        return res.status(404).json({ error: "Imagem não encontrada" });
      }
      res.redirect(background.caminho);
    } catch (error) {
      console.log(`getBgImage(${id}) error:`, error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      if (!req.files || !req.files.sprite_bg) {
        throw new Error("Arquivo sprite-bg é obrigatório");
      }
      const nome = req.body.nome;
      const bgFile = req.files.sprite_bg[0];

      const bgRef = ref(
        storage,
        `backgrounds/bg_${Date.now()}_${bgFile.originalname}`
      );

      await uploadBytes(bgRef, await fs.readFile(bgFile.path));

      const caminho = await getDownloadURL(bgRef);

      // Limpar arquivos temporários
      await fs.unlink(bgFile.path);

      const background = {
        nome,
        caminho,
      };

      const result = await backgroundModel.create(background);
      return res.status(201).json(result);
    } catch (error) {
      console.log("Create error:", error.message);
      return res.status(400).json(error.message);
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error("ID inválido");
      }

      const currentBackground = await backgroundModel.getById(id);
      if (!currentBackground) {
        throw new Error("Background não encontrado");
      }

      const nome = req.body.nome;
      let caminho = currentBackground.caminho;

      if (req.files?.sprite_bg) {
        const backgroundFile = req.files.sprite_bg[0];
        const backgroundRef = ref(
          storage,
          `backgrounds/bg_${Date.now()}_${backgroundFile.originalname}`
        );
        await uploadBytes(
          backgroundRef,
          await fs.readFile(backgroundFile.path)
        );
        caminho = await getDownloadURL(backgroundRef);
        await fs.unlink(backgroundFile.path);
      }

      const background = {
        nome,
        caminho,
      };

      const result = await backgroundModel.update(background, id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  delete(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const background = backgroundModel.delete(id);
    background
      .then((deletedBackground) => res.status(200).json(deletedBackground))
      .catch((error) => res.status(400).json(error.message));
  }
}

module.exports = new BackgroundController();
