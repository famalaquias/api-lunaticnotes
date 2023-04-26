/* up: processo de criar a tabela */
exports.up = knex => knex.schema.createTable("links", table => {
  /* campos da tabela */
  table.increments("id");
  table.text("url").notNullable(); // não aceita name nullo;
  
  /* onDelete("CASCADE"): se eu deletar a nota que essa tag está vinculada,
  automaticamente ele vai deletar a tag e os links */
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
  table.timestamp("created_at").default(knex.fn.now());
});

/* down: processo de deletar a tabela */
exports.down = knex => knex.schema.dropTable("links");
