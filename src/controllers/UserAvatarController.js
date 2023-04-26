/* 
  Vai processar as requisições da nossa aplicação;
*/

const knex = require('../database/knex');

const AppError = require('../utils/AppError');

const DiskStorage = require('../providers/DiskStorage');

class UserAvatarController {
  async update(req, res) {
    /* pega o id do usuário que quer atualizar a imagem dele */
    const user_id = req.user.id;
    /* pega o nome do arquivo que o usuário fez o upload */
    const avatarFilename = req.file.filename;

    /* instânciando o diskStorage*/
    const diskStorage = new DiskStorage();

    /* busca os dados do usuário para atualizar o avatar */
    const user = await knex("users")
    .where({ id: user_id }).first();

    /* se o usuário não existir */
    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    /* verifica se dentro do usuário existe um avatar */
    if (user.avatar) {
      /* se existir, deleta a foto antiga para coloca uma nova */
      await diskStorage.deleteFile(user.avatar);
    }

    /* caso não exista nenhuma foto */
    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    /* salvando a nova imagem */
    await knex("users").update(user).where({ id: user_id });

    return res.json(user);
  }
}

module.exports = UserAvatarController;
