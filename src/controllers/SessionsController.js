/* importando a conexão com o BD */
const knex = require('../database/knex');

/* importando o appError para lidar com exceções */
const AppError = require('../utils/AppError');

/* como a senha está guardada e criptografada no BD, usaremos "compare" 
do bcrypt.js: vai pegar a senha que o usuário digitou e comparar com a 
senha que existe no BD para esse usuário;
*/
const { compare } = require("bcryptjs");

/* importando as configurações de autenticação */
const authConfig = require('../configs/auth');

const { sign } = require('jsonwebtoken');

class SessionsController {
  /* criando uma sessão, um token, um código para o usuário */
  async create(req, res) {
    const { email, password } = req.body;

    /* Validando o usuário cadastrado:
    filtrando o usuário pelo email;
    após, verifica se o usuário existe no BD, se não existir lança um error */
    const user = await knex("users").where({ email }).first();
    if(!user) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    /* Validando a senha cadastrada pelo usuário:
    verifica se a senha está batendo com a cadastrada no BD */
    const passwordMatched = await compare(password, user.password);
    if(!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    /* Gerando o JWT:
    se o email e a senha do usuário existem, significa que o usuário tem 
    as credenciais de acesso, então geraremos um token e entregamos para 
    o usuário para que ele possa usar esse token como chave para fazer as 
    requisições já autenticadas em nossa aplicação */
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      /* subject: conteúdo que quero inserir dentro do token - no caso, o id */
      subject: String(user.id),
      expiresIn
    });

    return res.json({ user, token });
  }
}

module.exports = SessionsController;
