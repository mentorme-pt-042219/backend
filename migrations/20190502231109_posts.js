exports.up = function(knex, Promise) {
    // LOGIC TO DEFINE POSTS TABLE
    return knex.schema.createTable("posts", table => {
        table
            .increments("id")
        table
            .string("post_title", 128)
            .notNullable()
        table
            .text("post_body")
            .notNullable()
        table
            .integer("users_id")
            .unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.timestamps(true, true)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("posts")
};