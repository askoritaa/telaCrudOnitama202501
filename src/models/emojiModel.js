const db = require("../infra/conection");

class Emoji {
  constructor({ nome, preco, caminho_audio, caminho_imagem }) {
    this.nome = typeof nome === 'string' && nome.trim() ? nome : null;
    this.preco = Number.isInteger(parseInt(preco)) ? parseInt(preco) : null;
    this.caminho_audio = typeof caminho_audio === 'string' && caminho_audio.trim() ? caminho_audio : null;
    this.caminho_imagem = typeof caminho_imagem === 'string' && caminho_imagem.trim() ? caminho_imagem : null;
    this.active = true;
  }

  isValid(isUpdate = false) {
    if (isUpdate) {
      return this.nome !== null && this.preco !== null;
    }
    return (
      this.nome !== null &&
      this.preco !== null &&
      this.caminho_audio !== null &&
      this.caminho_imagem !== null
    );
  }

  getErrors(isUpdate = false) {
    const errors = [];
    if (!this.nome) errors.push("Nome do Emoji é obrigatório e deve ser uma string válida.");
    if (!Number.isInteger(this.preco)) errors.push("Preço deve ser um número inteiro.");
    if (!isUpdate) {
      if (!this.caminho_audio) errors.push("Imagem do Emoji é obrigatória e deve ser um arquivo válido.");
      if (!this.caminho_imagem) errors.push("Audio do Emoji é obrigatório e deve ser um arquivo válido.");
    }
    return errors;
  }
}


class EmojiModel {

    executeQuery(sql, params = "") {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve (result);
            })
        })
    }

  list() {
    const sql = "SELECT * FROM emojis WHERE active = true ORDER BY created_at DESC";
    return this.executeQuery(sql);    
  }

  getById(id) {
    const sql = "SELECT * FROM emojis WHERE active = true AND id_Emoji = ?";
    return this.executeQuery(sql, [id]).then((results) => {
      return results[0];
    });   
  }


  create(emoji) {
    const emojiData = new Emoji(emoji);
    if (!emojiData.isValid()) {
      return Promise.reject(new Error(emojiData.getErrors().join(" ")));
    }
    const sql = "INSERT INTO emojis SET ?";
    return this.executeQuery(sql, emojiData);
    
  }

  update(emojiToUpdate, id) {
    const emojiData = new Emoji(emojiToUpdate);
    if (!emojiData.isValid(true)) {
          console.log("update não é valido=="+ {emojiData});

      return Promise.reject(new Error(emojiData.getErrors(true).join(" ")));
    }
    const sql = "UPDATE emojis SET ? WHERE id_Emoji = ?";
    return this.executeQuery(sql, [emojiData, id]);    
  }

  delete(id) {
    const sql = "UPDATE emojis SET active = false WHERE id_Emoji = ?";
    return this.executeQuery(sql, [id]);
    
  }
}

module.exports = new EmojiModel();
