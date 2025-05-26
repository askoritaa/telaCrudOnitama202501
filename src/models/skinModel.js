const db = require("../infra/conection");

class Skin {
  constructor({ nome_Conjunto, preco, caminho_Pawn, caminho_King }) {
    this.nome_Conjunto = typeof nome_Conjunto === 'string' && nome_Conjunto.trim() ? nome_Conjunto : null;
    this.preco = Number.isInteger(parseInt(preco)) ? parseInt(preco) : null;
    this.caminho_Pawn = typeof caminho_Pawn === 'string' && caminho_Pawn.trim() ? caminho_Pawn : null;
    this.caminho_King = typeof caminho_King === 'string' && caminho_King.trim() ? caminho_King : null;
    this.sincronizado = false;
    this.active = true;
  }

  isValid(isUpdate = false) {
    if (isUpdate) {
      return this.nome_Conjunto !== null && this.preco !== null;
    }
    return (
      this.nome_Conjunto !== null &&
      this.preco !== null &&
      this.caminho_Pawn !== null &&
      this.caminho_King !== null
    );
  }

  getErrors(isUpdate = false) {
    const errors = [];
    if (!this.nome_Conjunto) errors.push("Nome do Conjunto é obrigatório e deve ser uma string válida.");
    if (!Number.isInteger(this.preco)) errors.push("Preço deve ser um número inteiro.");
    if (!isUpdate) {
      if (!this.caminho_Pawn) errors.push("Imagem do Peão é obrigatória e deve ser um arquivo válido.");
      if (!this.caminho_King) errors.push("Imagem do Rei é obrigatória e deve ser um arquivo válido.");
    }
    return errors;
  }
}


class SkinModel {

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
    const sql = "SELECT * FROM conjuntos_skins WHERE active = true ORDER BY created_at DESC";
    return this.executeQuery(sql);    
  }

  getById(id) {
    const sql = "SELECT * FROM conjuntos_skins WHERE active = true AND id_Conjunto = ?";
    return this.executeQuery(sql, [id]).then((results) => {
      return results[0];
    });   
  }


  create(skin) {
    const skinData = new Skin(skin);
    if (!skinData.isValid()) {
      return Promise.reject(new Error(skinData.getErrors().join(" ")));
    }
    const sql = "INSERT INTO conjuntos_skins SET ?";
    return this.executeQuery(sql, skinData);
    
  }

  update(skinToUpdate, id) {
    const skinData = new Skin(skinToUpdate);
    if (!skinData.isValid(true)) {
      return Promise.reject(new Error(skinData.getErrors(true).join(" ")));
    }
    const sql = "UPDATE conjuntos_skins SET ? WHERE id_Conjunto = ?";
    return this.executeQuery(sql, [skinData, id]);    
  }

  delete(id) {
    const sql = "UPDATE conjuntos_skins SET active = false WHERE id_Conjunto = ?";
    return this.executeQuery(sql, [id]);
    
  }
}

module.exports = new SkinModel();
