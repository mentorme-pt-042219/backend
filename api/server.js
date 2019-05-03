const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');

// DEFINE DATABASE CONFIGURATION
const dbConfig = require("../knexfile")
// DEFINE DATABASE
const db = knex(dbConfig.development);


const { authenticate, generateToken } = require('../auth/authenticate.js');


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
});

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
    const { username, industry, phoneNumber } = req.body;
    if (!username) {
        res
            .json({ message: "Username cannot be blank "})
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
        db.insert({ username, industry, phoneNumber })
        .into('users')
        .then(id => res.status(201).json({ id }))
        .catch(next);
    } 
    (req, res, next) => {
    res.status(500).json({ err });
    }
});







// list all users
server.get('/api/users', async (req, res) => {
    // get the users from the database
    try {
        const users = await db('users'); // all the records from the table
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});
  
// list a user by id
server.get('/api/users/:id', async (req, res) => {
// get the users from the database
try {
    const user = await db('users')
    .where({ id: req.params.id })
    .first();
    res.status(200).json(user);
} catch (error) {
    res.status(500).json(error);
}
});
  
const errors = {
'19': 'Another record with that value exists',
};
  
// create users
server.post('/api/users', async (req, res) => {
try {
    const [id] = await db('users').insert(req.body);

    const user = await db('users')
    .where({ id })
    .first();

    res.status(201).json(user);
} catch (error) {
    const message = errors[error.errno] || 'We ran into an error';
    res.status(500).json({ message, error });
}
});

// update users
server.put('/api/users/:id', async (req, res) => {
    try {
        const count = await db('users')
        .where({ id: req.params.id })
        .update(req.body);

        if (count > 0) {
        const user = await db('users')
            .where({ id: req.params.id })
            .first();

        res.status(200).json(user);
        } else {
        res.status(404).json({ message: 'Records not found' });
        }
    } catch (error) {}
});
  
// remove users (inactivate the user)
server.delete('/api/users/:id', async (req, res) => {
    try {
        const count = await db('users')
        .where({ id: req.params.id })
        .del();

        if (count > 0) {
        res.status(204).end();
        } else {
        res.status(404).json({ message: 'Records not found' });
        }
    } catch (error) {}
});

// configureRoutes(server);

module.exports = server;