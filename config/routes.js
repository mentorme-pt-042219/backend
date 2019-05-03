const axios = require('axios');
const bcrypt = require('bcrypt'); // IMPORT BCRYPT

const { authenticate, generateToken } = require('../auth/authenticate.js');

// const Users = require("./users-model.js");

module.exports = server => {
    server.post('/api/register', register);
    server.post('/api/login', login);
    server.get('/api/jokes', 
        authenticate, 
        getJokes);
};

function register(req, res) {
    // implement user registration
    const { username, password, industry, phoneNumber } = req.body;
    if (!password || !username ) {
        res
            .json({ message: "Username and/or password cannot be blank"})
    } 
    // else if 
    //     (!industry) {
    //         res
    //             .json({ message: "Industry cannot be blank "})
    //     } 
    // else if 
    //     (!phoneNumber) {
    //         res
    //             .json({ message: "Phone number cannot be blank "})
    //         } 
    else {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        Users.add(user) 
        .then(saved => {
            const token = generateToken(saved)
            // res
            //     .status(201)
            //     .json({
            //         message: `${username} has been successfully registered`,
            //         token
            //     });
        })
        .catch(error => {
            res
            .status(500)
            .json({ 
                message: "Unable to register user",
                error
            });
        });
        next();
    }
}

function login(req, res) {
  // implement user login
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res
            .status(200)
            .json({ 
            message: `Welcome, ${user.username}!`,
            token
            });
        } else {
        res
            .status(401)
            .json({ 
            message: 'Invalid Credentials' 
            });
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
}

function getJokes(req, res) {
    const requestOptions = {
        headers: { accept: 'application/json' },
    };

    axios
        .get('https://icanhazdadjoke.com/search', requestOptions)
        .then(response => {
            res.status(200).json(response.data.results);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error Fetching Jokes', error: err });
        });
}