/* Para todas as rotas de usuários */
const { Router } = require('express');

const TagsController = require('../controllers/TagsController');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const tagsRouter = Router();

/* Instanciando a classe */
const tagsController = new TagsController();

tagsRouter.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRouter;
