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
      filename: "./data/mentorme.db3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations"
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || localPgConnection,
    migrations: {
      directory: "./migrations"
    }
  }
};
