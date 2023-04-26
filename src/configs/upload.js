/* Arquivo de configurações do upload de imagens */
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

/* pasta temperária onde a imagem chega */
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");

/* onde de fato a imagem vai ficar */
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

/* Multer é a biblioteca que vai utilizar para fazer o upload */
const MULTER = {
  storage: multer.diskStorage({
    /* destino, para onde vai o arquivo */
    destination: TMP_FOLDER,
    /* é o nome do arquivo */
    filename(req, file, callback) {
      /* crypto: para gerar um hash de forma aleatória 
      para garantir que o nome do arquivo seja único */
      const fileHash = crypto.randomBytes(10).toString("hex");
      /* fileName: criando o nome do arquivo */
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}
