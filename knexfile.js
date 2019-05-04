const localPgConnection = {
  host: "localhost",
  database: "mentorme",
  user: "student",
  password: "dummy"
}

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: "./database/mentorme.db3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations"
    }
  },

  production: {
    client: 'pg',
    connection: process.env.HEROKU_POSTGRESQL_BROWN_URL || localPgConnection,
    migrations: {
      directory: "./migrations"
    },
  }
  
};
