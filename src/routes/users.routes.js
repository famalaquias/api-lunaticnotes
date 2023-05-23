const { Router } = require('express');
const multer = require('multer');

const uploadConfig = require('../configs/upload');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const UsersController = require('../controllers/UsersController');
const UserAvatarController = require('../controllers/UserAvatarController');

const userRoutes = Router();
/* upload: vai ser o multer e precisa passar para ele as 
configurações do upload(uploadConfig) */
const upload = multer(uploadConfig.MULTER);

/* Instanciando a classe na memória */
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

userRoutes.post("/", usersController.create);
// userRoutes.put("/:id", usersController.update);
/* após criar o arquivo e a rota de autenticação do usuário */
userRoutes.put("/", ensureAuthenticated, usersController.update);
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

module.exports = userRoutes;
