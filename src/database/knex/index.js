/* 
  Arquivo de conexão do Knex;
*/
const config = require('../../../knexfile');
const knex = require('knex');

const connection = knex(config.development);

module.exports = connection;
