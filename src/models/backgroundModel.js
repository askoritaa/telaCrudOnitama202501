const db = require("../infra/conection");

class Background {
  constructor({ nome, caminho }) {
    this.nome = typeof nome === 'string' && nome.trim() ? nome : null;
    this.caminho = typeof caminho === 'string' && caminho.trim() ? caminho : null;
    this.sincronizado = false;
    this.active = true;
  }

  isValid(isUpdate = false) {
    if (isUpdate) {
      return this.nome !== null;
    }
    return (
      this.nome !== null &&
      this.caminho !== null
    );
  }

  getErrors(isUpdate = false) {
    const errors = [];
    if (!this.nome) errors.push("Nome do Background é obrigatório e deve ser uma string válida.");
    if (!isUpdate) {
      if (!this.caminho) errors.push("Imagem do Background é obrigatória e deve ser um arquivo válido.");
    }
    return errors;
  }
}

class BackgroundModel {

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
    const sql = "SELECT * FROM backgrounds WHERE active = true";
    return this.executeQuery(sql);    
  }

  getById(id) {
    const sql = "SELECT * FROM backgrounds WHERE active = true AND id_Background = ?";
    return this.executeQuery(sql, [id]).then((results) => {
      return results[0];
    });   
  }


  create(background) {
    const backgroundData = new Background(background);
    if (!backgroundData.isValid()) {
      return Promise.reject(new Error(backgroundData.getErrors().join(" ")));
    }
    const sql = "INSERT INTO backgrounds SET ?";
    return this.executeQuery(sql, backgroundData);
    
  }

  update(backgroundToUpdate, id) {
    const backgroundData = new Background(backgroundToUpdate);
    if (!backgroundData.isValid(true)) {
      return Promise.reject(new Error(backgroundData.getErrors(true).join(" ")));
    }
    const sql = "UPDATE backgrounds SET ? WHERE id_Background = ?";
    return this.executeQuery(sql, [backgroundData, id]);    
  }

  delete(id) {
    const sql = "UPDATE backgrounds SET active = false WHERE id_Background = ?";
    return this.executeQuery(sql, [id]);
    
  }
}

module.exports = new BackgroundModel();