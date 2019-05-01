const express = require('express'); 
const helmet = require('helmet'); 
const cors = require('cors');

const server = express(); // USE EXPRESS 

server.use(helmet()); // USE HELMET
server.use(express.json(), cors()); // USE MIDDLEWARE

module.exports = server;

// ENDPOINT TEST
server.get('/', async (req, res) => {
    res
        .status(200)
        .json({ API: 'UP AND RUNNING' });
});