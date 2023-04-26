/* 
  Utilizando o framework Express na aplicação;
  Arquivo de configuração do express;
*/

require('express-async-errors');

const migrationsRun = require('./database/sqlite/migrations');

const AppError = require('./utils/AppError');
const uploadConfig = require('./configs/upload');

/* express: pega todas as funcionalidades da pasta node_modules e coloca aqui, na aplicação */
const express = require('express');
/* importação das rotas da aplicação */
const routes = require('./routes');
/* habilita o backend para que consiga atender as requisições do frontend */
const cors = require('cors');
/* inicializando o express */
const app = express();

/* diz para a aplicação que esses conteúdos que vão vir pelo 
corpo da requisição, serão no formato JSON */
app.use(express.json());
app.use(cors());
/* serve para pegar a imagem carregada pelo usuário e mostrá-la 
no insomnia */
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

migrationsRun();

/* Tratando erros de exceção */
app.use(( error, _req, res, _next ) => {
  /* se o error foi gerado pelo cliente */
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.log(error);

  /* se o error não foi gerado pelo cliente, emite um erro padrão */
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
});

/* porta que o express ficará observando as requisições */
const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
