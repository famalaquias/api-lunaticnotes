/* 
  Tratamento de Exeção - através do Middleware;
  Padroniza o tipo de mensagem que vai aparecer quando tiver alguma exceção;
*/
class AppError {
  message;
  statusCode;

  /* 
    Toda classe tem o método construtor;
    Esse método é carregado automaticamente quando a classe
    é instanciada;
  */
  constructor(message, statusCode = 400) {
    /* this: repassa as informações ao contexto global; */
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
