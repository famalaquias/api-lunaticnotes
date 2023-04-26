/*
  Configurações de autenticação da nossa aplicação - jwt;
*/
module.exports = {
  jwt: {
    /* uma palavra/chave secreta */
    secret: "default",
    /* um tempo de expiração */
    expiresIn: "1d",
  }
}
