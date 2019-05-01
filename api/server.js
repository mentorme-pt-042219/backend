const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex'); // NEW


// knex(knexConfig) = {
//     client: 'sqlite3',
//     useNullAsDefault: true,
//     connection: {
//         filename: './data/mentor.db3'
//     }
// }

// const context = knex(knexConfig);


const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

// TEST ROUTE
server.get('/', (req, res) => {
    res
        .status(200)
        .json({ API: 'UP AND RUNNING' });
});

configureRoutes(server);

module.exports = server;