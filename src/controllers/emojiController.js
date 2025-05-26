const { getDownloadURL, ref, uploadBytes } = require("firebase/storage");
const emojiModel = require("../models/emojiModel");
const storage = require("../infra/firebaseStorage");
const fs = require("fs").promises;

class EmojiController {
  search(req, res) {
    const listEmojis = emojiModel.list();
    return listEmojis
      .then((emojis) => res.status(200).json(emojis))
      .catch((error) => res.status(400).json(error.message));
  }

  getEmojiById(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const listEmojiById = emojiModel.getById(id);
    return listEmojiById
      .then((emoji) => {
        if (!emoji) {
          return res.status(404).json({ error: "Emoji não encontrado" });
        }
        res.status(200).json(emoji);
      })
      .catch((error) => res.status(400).json(error.message));
  }

  async getEmojiImage(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const emoji = await emojiModel.getById(id);
      console.log(
        `getEmojiImage(${id}): emoji exists: ${!!emoji}, caminho_image: ${
          emoji?.caminho_image
        }`
      );
      if (!emoji || !emoji.caminho_image) {
        return res.status(404).json({ error: "Imagem não encontrada" });
      }
      res.redirect(emoji.caminho_image);
    } catch (error) {
      console.log(`getEmojiImage(${id}) error:`, error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAudioEmoji(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const emoji = await emojiModel.getById(id);
      console.log(
        `getAudioEmoji(${id}): emoji exists: ${!!emoji}, caminho_audio: ${
          emoji?.caminho_audio
        }`
      );
      if (!emoji || !emoji.caminho_audio) {
        return res.status(404).json({ error: "Audio não encontrado" });
      }
      res.redirect(emoji.caminho_audio);
    } catch (error) {
      console.log(`getAudioEmoji(${id}) error:`, error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      if (!req.files || !req.files.sprite_emoji || !req.files.audio_emoji) {
        throw new Error("Arquivos sprite_emoji e audio_emoji são obrigatórios");
      }
      const nome = req.body.nome_emoji;
      const preco = req.body.preco;
      const imageFile = req.files.sprite_emoji[0];
      const audioFile = req.files.audio_emoji[0];

      const imageRef = ref(
        storage,
        `emojis/image_${Date.now()}_${imageFile.originalname}`
      );
      const audioRef = ref(
        storage,
        `emojis/audio_${Date.now()}_${audioFile.originalname}`
      );

      await uploadBytes(imageRef, await fs.readFile(imageFile.path));
      await uploadBytes(audioRef, await fs.readFile(audioFile.path));

      const caminho_imagem = await getDownloadURL(imageRef);
      const caminho_audio = await getDownloadURL(audioRef);

      // Limpar arquivos temporários
      await fs.unlink(imageFile.path);
      await fs.unlink(audioFile.path);

      const emoji = {
        nome,
        preco,
        caminho_imagem,
        caminho_audio,
      };

      const result = await emojiModel.create(emoji);
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

      const currentEmoji = await emojiModel.getById(id);
      if (!currentEmoji) {
        throw new Error("Emoji não encontrado");
      }

      const nome = req.body.nome_emoji;
      const preco = req.body.preco;
      let caminho_imagem = currentEmoji.caminho_imagem;
      let caminho_audio = currentEmoji.caminho_audio;

      if (req.files?.sprite_emoji) {
        const imageFile = req.files.sprite_emoji[0];
        const imageRef = ref(
          storage,
          `emojis/image_${Date.now()}_${imageFile.originalname}`
        );
        await uploadBytes(imageRef, await fs.readFile(imageFile.path));
        caminho_imagem = await getDownloadURL(imageRef);
        await fs.unlink(imageFile.path);
      }

      if (req.files?.audio_emoji) {
        const audioFile = req.files.audio_emoji[0];
        const audioRef = ref(
          storage,
          `emojis/audio_${Date.now()}_${audioFile.originalname}`
        );
        await uploadBytes(audioRef, await fs.readFile(audioFile.path));
        caminho_King = await getDownloadURL(audioRef);
        await fs.unlink(audioFile.path);
      }

      const emoji = {
        nome,
        preco,
        caminho_imagem,
        caminho_audio,
      };

      const result = await emojiModel.update(emoji, id);
      return res.status(200).json(result);
    } catch (error) {
      console.log("error em controller update" + error);
      return res.status(400).json({ error: error.message });
    }
  }

  delete(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const emoji = emojiModel.delete(id);
    emoji
      .then((deletedEmoji) => res.status(200).json(deletedEmoji))
      .catch((error) => res.status(400).json(error.message));
  }
}

module.exports = new EmojiController();
