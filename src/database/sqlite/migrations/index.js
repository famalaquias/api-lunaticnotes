/* 
  Arquivo de conexão das migrations;
*/
const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers');

/* migrationsRun: função que vai rodar as migrations */
async function migrationsRun() {
  /* schemas: se refere as tabelas que o BD terá */
  const schemas = [
    createUsers
  ].join(''); 
  /* join: junta todas as migrations */

  sqliteConnection()
  /* then: vai executar os schemas */
  .then(db => db.exec(schemas))
  /* catch: tratamento de error */
  .catch(error => console.error(error));
}

module.exports = migrationsRun;
