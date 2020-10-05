
exports.up = function(knex, Promise) {
    return knex.schema.createTable("post",function(table){
        table.increments().primary();
        table.string("title");
        table.string("content");
        table.integer("userId").unsigned().references("id").inTable("user").onDelete('CASCADE');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("post");
};
