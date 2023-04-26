/* Para todas as rotas de usuários */
const { Router } = require('express');

const SessionsController = require("../controllers/SessionsController");

const sessionsRouter = Router();

/* Instanciando a classe */
const sessionsController = new SessionsController();

sessionsRouter.post("/", sessionsController.create);

module.exports = sessionsRouter;
