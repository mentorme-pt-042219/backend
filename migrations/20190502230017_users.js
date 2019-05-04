exports.up = function(knex, Promise) {
    // LOGIC TO DEFINE OUR USERS TABLE
    return knex.schema.createTable("users", table => {  //takes in table name and callback function 
        table
            .increments('id');
        table
            .string("username", 128) 
            .notNullable()
            .unique();
        table
            .enum("industry", [
                "Healthcare",
                "Information Technology",
                "Retail",
                "Government",
                "Financial Services",
                "Education",
                "Hospitality",
            ])
            .notNullable();
        table
            .string("password")
            .notNullable();
        table
            .bigInteger("phoneNumber", 11);
        table
            .timestamps(true, true);
    }) 
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("users")
};