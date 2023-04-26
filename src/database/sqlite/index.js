/* 
  Arquivo onde será colocado o banco de dados;
*/
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

/* path: resolve os endereços, pastas de acordo com o ambiente */
const path = require('path');

/* async: porque se no momento que a aplicação iniciar o 
banco de dados não existir, será criado automaticamente */
async function sqliteConnection() {

  /* open: abrindo uma conexão */
  const database = await sqlite.open({
    /* objeto com as configurações da conexão: */
    filename: path.resolve(__dirname, "..", "database.db"), 
    /* filename: onde irá salvar o arquivo do BD */
    driver: sqlite3.Database
    /* drive de conexão que irá utilizar */
  });

  return database;
}

module.exports = sqliteConnection;
