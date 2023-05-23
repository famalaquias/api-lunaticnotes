/* importando a conexão com o BD */
const knex = require('../database/knex');

/* importando o appError para lidar com exceções */
const AppError = require('../utils/AppError');

/* como a senha está guardada e criptografada na base de dados, 
usaremos a função "compare" do bcrypt.js para comparar a senha 
que o usuário digitou e com a senha que existe no BD para esse 
usuário;
*/
const { compare } = require("bcryptjs");

/* importando as configurações de autenticação */
const authConfig = require('../configs/auth');

const { sign } = require('jsonwebtoken');

class SessionsController {
  /* create: criando uma sessão, para dar um token, um código 
  para o usuário */
  async create(req, res) {
    const { email, password } = req.body;

    /* validando o usuário cadastrado pelo email;
    verifica se o usuário existe no BD, SE NÃO existir, lança um error;
    knex: é usado para acessar tabelas, nesse caso, a tabela de users;
    where: filtra o usuário pelo email cadastrado no BD;
    first: garante que traga apenas um usuário com esse email;
    */
    const user = await knex("users").where({ email }).first();
    if(!user) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    /* validando a senha cadastrada pelo usuário:
    verifica/compara se a senha está batendo com a cadastrada 
    no BD */
    const passwordMatched = await compare(password, user.password);
    if(!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    /* gerando o JWT: se o email e a senha do usuário existem, 
    significa que o usuário tem as credenciais de acesso, então
    geraremos um token e entregamos para o usuário para que ele 
    possa usar esse token como chave para fazer as requisições 
    já autenticadas em nossa aplicação */
    const { secret, expiresIn } = authConfig.jwt;
    
    const token = sign({}, secret, {
      /* subject: conteúdo que quero inserir dentro do token - 
      no caso, o id do usuário */
      subject: String(user.id),
      expiresIn
    });

    return res.json({ user, token });
  }
}

module.exports = SessionsController;
