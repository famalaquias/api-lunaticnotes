/* up: processo de criar a tabela */
exports.up = knex => knex.schema.createTable("notes", table => {
  /* campos da tabela */
  table.increments("id");
  table.text("title");
  table.text("description");
  table.integer("user_id").references("id").inTable("users");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());  
});

/* down: processo de deletar a tabela */
exports.down = knex => knex.schema.dropTable("notes");
