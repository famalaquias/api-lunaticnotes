/* Arquivo para identificação do usuário que está fazendo a requisição */
const { verify } = require('jsonwebtoken');

const AppError = require('../utils/AppError');

const authConfig = require('../configs/auth');

function ensureAuthenticated(req, res, next) {
  /* authHeader: obter o cabeçalho;
  é onde vai estar o token do usuário  */
  const authHeader = req.headers.authorization;

  /* caso o token não exista */
  if(!authHeader) {
    throw new AppError("JWT Token não informado", 401);
  }

  /* se o token existir, vamos acessar através de um vetor o que está dentro
  do header;
  split: pega a string e a separa passando ela para um vetor (quebra o texto) */
  const [, token] = authHeader.split(" ");

  /* tratamento de exceção */
  try {
    /* verifica se o token é válido, se é válido, devolve o sub: 
    conteúdo do token */
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    /* cria dentro da requisição uma propriedade chamada "user" e dentro
    dela cria uma propriedade chamada ID */
    req.user = {
      id: Number(user_id),
    };

    /* se der tudo certo, chama o next: próxima função, que é o destino da 
    aplicação */
    return next();
  } catch {
    /* se algo der errado, retorna o error */
    throw new AppError("JWT Token inválido", 401);        
  }
}

module.exports = ensureAuthenticated;
