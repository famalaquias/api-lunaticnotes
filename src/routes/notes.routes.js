const { Router } = require('express');

const NotesController = require('../controllers/NotesController');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const notesRoutes = Router();

/* Instanciando a classe */
const notesController = new NotesController();

/* quando quer usar o middleware de autenticação em todas as rotas */
notesRoutes.use(ensureAuthenticated);

notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.get("/", notesController.index);

module.exports = notesRoutes;
