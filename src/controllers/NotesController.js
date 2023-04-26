/* 
  Vai processar as requisições da nossa aplicação 
*/
const knex = require('../database/knex');

class NotesController {
  /* 
    create: criando notas;
    método POST;
  */
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const user_id = req.user.id;

    /* inserindo uma nota e recuperando o id/código da nota inserida */
    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id
    });


    /*  Links: */
    /* vai percorrer cada link que tem e retornar o código da 
    nota que o link está vinculado (note_id) e mudando de link 
    para URL */
    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    });

    /* vai inserir os links que quiser */
    await knex("links").insert(linksInsert);

    /* Tags: */
    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });
 
    /* vai inserir as tags que quiser */
    await knex("tags").insert(tagsInsert);

    return res.json();
  }

  /* 
    show: mostra os dados das notas;
    método GET;
  */
  async show(req, res) {
    const { id } = req.params;

    /* selecionando a primeira nota baseando no ID */
    const note = await knex("notes").where({ id }).first();

    /* selecionando as tags baseando no ID da nota por ordem alfabética de nome */
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    /* selecionando as links baseando no ID da nota por ordem alfabética de criação */
    const links = await knex("links").where({ note_id: id }).orderBy("created_at");

    return res.json({
      ...note,
      tags, 
      links
    });
  }

  /* 
    delete: deleta as notas;
    método DELETE;
  */
  async delete(req, res) {
    const { id } =  req.params;

    await knex("notes").where({ id }).delete();

    return res.json();
  }

  /* 
    index: listar as notas;
    método GET;
  */
  async index(req, res) {
    // const { title, tags } = req.query;
    // const user_id = req.user.id;
    const { title, tags } = req.query;
    const user_id = req.user.id;

    let notes;

    if(tags) {
      /* filterTags: converte as tagas de um texto simples 
      para um vetor, para serem enviadas em listas */
      const filterTags = tags.split(',').map(tag => tag.trim());

      notes = await knex("tags")
      .select([
        "notes.id",
        "notes.title",
        "notes.user_id"
      ])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      /* whereIn: filtra com base nas tags: pega o nome da tag
      e o vetor (filterTags) para que ele compare se a tag de 
      fato existe ali ou não */
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes.id", "tags.note_id")
      .groupBy("notes.id")
      .orderBy("notes.title");
    } else {
    /* busca as notas criadas pelo usuário através do seu ID */
    notes = await knex("notes")
    .where({ user_id })
    /* whereLike: ajuda a buscar por valores em qualquer parte da palavra,
    por exemplo, tudo que tiver a palavra title traga pra mim */
    .whereLike("title", `%${title}%`)
    .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    /* percorre todas as notas e filtra as tags das notas */
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    });

    return res.json(notesWithTags);
  }
}

module.exports = NotesController;
