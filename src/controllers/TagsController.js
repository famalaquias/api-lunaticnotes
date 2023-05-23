/* 
  Vai processar as requisições da nossa aplicação 
*/
const knex = require('../database/knex');

class TagsController {
  /* 
    index: lista todas as tagas cadastradas do usuário ;
    método GET;
  */
  async index(req, res) {
    /* Antes do middleware de autenticação */
    /* const { user_id } = req.params; */

    /* Depois do middleware de autenticação */
    const user_id = req.user.id;

    const tags = await knex("tags")
    .where({ user_id })
    .groupBy("name");

    return res.json(tags);
  }
}

module.exports = TagsController;
