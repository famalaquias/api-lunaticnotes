/* 
  Criando a tabela de usuários através das migrations;
*/
const createUsers = `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR, 
  email VARCHAR, 
  password VARCHAR,
  avatar VARCHAR NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

module.exports = createUsers;

/* IF NOT EXISTS: só criaremos a tabela se não existir a tabela de usuários */
