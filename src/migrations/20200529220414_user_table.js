
exports.up = function(knex, Promise) {
  return knex.schema.createTable("user",function(table){
      table.increments().primary();
      table.string("email");
      table.string("password");
      table.string("token");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("user");
};
