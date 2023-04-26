/* Salva o arquivo no storage do disco do backend */
const fs = require('fs');
const path = require('path');

const uploadConfig = require('../configs/upload');

class DiskStorage {
  /* Função de SALVAR o arquivo */
  async saveFile(file) {
    await fs.promises.rename(
      /* remane: é para mudar o arquivo de lugar, de pasta;
      tira da pasta temporária e leva para nova pasta */
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  /* Função de DELETAR o arquivo */
  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      /* stat: retorna o status do arquivo */
      await fs.promises.stat(filePath);      
    } catch {
      return;      
    }

    /* unlink: remove um arquivo */
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
