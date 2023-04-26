/* up: processo de criar a tabela */
exports.up = knex => knex.schema.createTable("tags", table => {
  /* campos da tabela */
  table.increments("id");
  table.text("name").notNullable(); // não aceita name nullo;
  
  /* onDelete("CASCADE"): se eu deletar a nota que essa tag está vinculada,
  automaticamente ele vai deletar a tag */
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
  table.integer("user_id").references("id").inTable("users");
});

/* down: processo de deletar a tabela */
exports.down = knex => knex.schema.dropTable("tags");
