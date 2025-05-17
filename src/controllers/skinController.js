const { getDownloadURL, ref, uploadBytes } = require("firebase/storage");
const skinModel = require("../models/skinModel");
const storage = require("../infra/firebaseStorage");
const fs = require("fs").promises;

class SkinController {
  search(req, res) {
    const listSkins = skinModel.list();
    return listSkins
      .then((skins) => res.status(200).json(skins))
      .catch((error) => res.status(400).json(error.message));
  }

  getSkinById(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const listSkinById = skinModel.getById(id);
    return listSkinById
      .then((skin) => {
        if (!skin) {
          return res.status(404).json({ error: "Skin não encontrada" });
        }
        res.status(200).json(skin);
      })
      .catch((error) => res.status(400).json(error.message));
  }

  async getPawnImage(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const skin = await skinModel.getById(id);
      console.log(
        `getPawnImage(${id}): skin exists: ${!!skin}, caminho_pawn: ${
          skin?.caminho_pawn
        }`
      );
      if (!skin || !skin.caminho_Pawn) {
        return res.status(404).json({ error: "Imagem não encontrada" });
      }
      res.redirect(skin.caminho_pawn);
    } catch (error) {
      console.log(`getPawnImage(${id}) error:`, error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getKingImage(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const skin = await skinModel.getById(id);
      console.log(
        `getKingImage(${id}): skin exists: ${!!skin}, caminho_king: ${
          skin?.caminho_king
        }`
      );
      if (!skin || !skin.caminho_King) {
        return res.status(404).json({ error: "Imagem não encontrada" });
      }
      res.redirect(skin.caminho_king);
    } catch (error) {
      console.log(`getKingImage(${id}) error:`, error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      if (!req.files || !req.files.sprite_pawn || !req.files.sprite_king) {
        throw new Error("Arquivos sprite_pawn e sprite_king são obrigatórios");
      }
      const nome_Conjunto = req.body.nome_conjunto;
      const preco = req.body.preco;
      const pawnFile = req.files.sprite_pawn[0];
      const kingFile = req.files.sprite_king[0];

      const pawnRef = ref(
        storage,
        `skins/pawn_${Date.now()}_${pawnFile.originalname}`
      );
      const kingRef = ref(
        storage,
        `skins/king_${Date.now()}_${kingFile.originalname}`
      );

      await uploadBytes(pawnRef, await fs.readFile(pawnFile.path));
      await uploadBytes(kingRef, await fs.readFile(kingFile.path));

      const caminho_Pawn = await getDownloadURL(pawnRef);
      const caminho_King = await getDownloadURL(kingRef);

      // Limpar arquivos temporários
      await fs.unlink(pawnFile.path);
      await fs.unlink(kingFile.path);

      const skin = {
        nome_Conjunto,
        preco,
        caminho_Pawn,
        caminho_King,
      };

      const result = await skinModel.create(skin);
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

      const currentSkin = await skinModel.getById(id);
      if (!currentSkin) {
        throw new Error("Skin não encontrada");
      }

      const nome_Conjunto = req.body.nome_conjunto;
      const preco = req.body.preco;
      let caminho_Pawn = currentSkin.caminho_Pawn;
      let caminho_King = currentSkin.caminho_King;

      if (req.files?.sprite_pawn) {
        const pawnFile = req.files.sprite_pawn[0];
        const pawnRef = ref(
          storage,
          `skins/pawn_${Date.now()}_${pawnFile.originalname}`
        );
        await uploadBytes(pawnRef, await fs.readFile(pawnFile.path));
        caminho_Pawn = await getDownloadURL(pawnRef);
        await fs.unlink(pawnFile.path);
      }

      if (req.files?.sprite_king) {
        const kingFile = req.files.sprite_king[0];
        const kingRef = ref(
          storage,
          `skins/king_${Date.now()}_${kingFile.originalname}`
        );
        await uploadBytes(kingRef, await fs.readFile(kingFile.path));
        caminho_King = await getDownloadURL(kingRef);
        await fs.unlink(kingFile.path);
      }

      const skin = {
        nome_Conjunto,
        preco,
        caminho_Pawn,
        caminho_King,
      };

      const result = await skinModel.update(skin, id);
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
    const skin = skinModel.delete(id);
    skin
      .then((deletedSkin) => res.status(200).json(deletedSkin))
      .catch((error) => res.status(400).json(error.message));
  }
}

module.exports = new SkinController();
