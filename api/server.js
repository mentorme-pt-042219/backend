const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcrypt'); // NEW <<

// DEFINE DATABASE CONFIGURATION
const dbConfig = require("../knexfile")
// DEFINE DATABASE
const db = knex(dbConfig.development);


const { authenticate, generateToken } = require('../auth/authenticate.js');
const { login, register } = require('../config/routes'); // NEW <<

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

// TEST API
server.get('/api/test', authenticate, (req, res) => {
    db
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

// RETRIEVE ALL USERS   
server.get('/api/users', (req, res, next) => {
    db('users')
        .then(data => res.status(200).json(data))
        .catch(next)
});


// RETREIVE USER BY ID
server.get('/api/users/:id', (req, res, next) => {
    const { id } = req.params;
        db.select()
            .from('users')
            .where({ id })
            .then(usersArr => {
                db.select()
                    .from('posts')
                    .where('users_id', id)
                    .then(posts => {
                        const users = usersArr[0];
                res.status(200).json({
                    id: users.id,
                    username: users.username,
                    industry: users.industry,
                    phoneNumber: users.phoneNumber,
                    posts: posts.map(posts => {
                        return {
                            id: posts.id,
                            title: posts.title,
                            question: posts.question,
                        }
                    })
                })
            })
            .catch(next)
        })
        .catch(next)
    }, (req, res, next) => {
        res.status(500).json({ err });
    }
);

// CREATE A USER
server.post('/api/users', (req, res, next) => {
    const { username, industry, password, phoneNumber } = req.body;
    if (!password || !username ) {
        res
            .json({ message: "Username and/or password cannot be blank"})
        } 
    else if 
        (!industry) {
            res
                .json({ message: "Industry cannot be blank "})
        } 
    else if 
        (!phoneNumber) {
            res
                .json({ message: "Phone number cannot be blank "})
            } 
    else {
        db
            .insert({ username, industry, phoneNumber })
            .into('users')
            .then(id => res
                .status(201)
                .json({ message: `${username} has been successfully registerd` }))
            .catch(next);
    } 
    (req, res, next) => {
    res.status(500).json({ err });
    }
});

// LOGIC FOR DELETING A USER


// LOGIC FOR LISTING ALL POSTS
server.get('/api/posts', (req, res, next) => {
    db
        .select()
        .from('posts')
        .then(posts => res.status(200).json(posts))
        .catch(next)
    }, (req, res, next) => {
    res.status(500).json(err);
});

// LOGIC FOR CREATING A NEW POST
server.post('/api/posts', (req, res, next) => {
    const { title, question, users_id } = req.body;
    db
        .insert({ title, question, users_id })
        .into('posts')
        .then(id => res.status(201).json({ id }))
        .catch(next)
    }, (req, res, next) => {
    res
        .status(500).json(err);
});

// LOGIC FOR EDITING A POST

// LOGIC FOR DELETING A POST

// configureRoutes(server);

module.exports = server;