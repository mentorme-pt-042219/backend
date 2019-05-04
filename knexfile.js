module.exports = {

  development: {
    client: "sqlite3",
    connection: {
      filename: "./database/mentorme.db3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations",
      tableName: "dbMigrations"
    }
  },

  production: {
    client: "pg",
    connection: `${process.env.DATABASE_URL}`,
    ssl: true,
    migrations: {
      directory: "./migrations",
      tableName: "dbMigrations"
    },
  }
  
};
