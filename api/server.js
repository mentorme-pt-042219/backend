const express = require("express");

const configMiddleware = require("./middleware.js");
const authRouter = require("../auth/authRouter.js");
const usersRouter = require("../routers/usersRouter.js");
const postsRouter = require("../routers/postsRouter.js");

const restricted = require("../auth/restricted");

const server = express();

configMiddleware(server);

server.use("/", authRouter);
server.use("/users", restricted, usersRouter);
server.use("/posts", restricted, postsRouter);

const db = require("../database/dbConfig");

// TEST ROUTE
server.get("/", (req, res) => {
    res
        .status(200)
        .json({ API: "UP AND RUNNING" });
});

server.get('/api/test', (req, res) => {
    db("users") 
        .select()
        .from('users')
        .then(data => 
            res
                .json(data))
                .catch(err => 
                    console.log(err)
                )
    }
);

module.exports = server;