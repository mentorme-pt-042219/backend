const express = require('express');
const router = express.Router();

const usersDb = require('../database/helpers/usersDb');

const restricted = require('../auth/restricted');
const auth = require('../auth/verifyAuth');


// Gets listing of all users 
router.get('/api/users', (req, res) => {
    db('users')
        .then(data => res.status(200).json(data))
        .catch(next);
});

router.get('/', async(req, res) => {

    try {
        const users = await usersDb.get();
        if(users) {
            res
                .json(users);
        }
    } 
    catch (err) {
        res
            .status(500)
            .json({ err: "A listing of users cannot be retreived at this time." });
    }
});

// Gets a user by username
router.get('/:id', async(req, res) => {
    usersDb
        .getById(req.params.id)
        .then(user => {
            if (user) {
                res
                    .json(user);
            }
            else {
                res
                    .status(404)
                    .json({ message: "A user with that username does not exist." });
            }  
        })
        .catch (err => 
            res
                .status(500)
                .json({ err: "User information cannot be retreived at this time.", err })
        );
});

// Updates a user account
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;

    usersDb
        .update(id, updatedUser)
        .then(user => {
            if(user) {
                res
                    .json({ message: "Your account has been updated!" });
            }
            else {
                res
                    .status(404)
                    .json({ message: "User with specified id not found." });
            }
        })
        .catch (err => 
            res
                .status(500)
                .json({ message: "Account update failed." })
        );
});


// Deletes a user account
router.delete('/:id', async (req, res) => {
    let user = req.body;

    try {
        const user = await usersDb.remove(req.params.id);
        if (user) {
            res
                .json({ message: `The account belonging to ${user.username} has been deleted` });
        } 
        else {
            res
                .status(404)
                .json({ message: 'The user with specified username does not exist.' });
        }
    } catch (err) {
        res
            .status(500)
            .json({ err: 'The requested user account cannot be removed at this time.' });
    }
});

// Listing of posts by user
router.get('/:username/post', async(req, res) => {
    try {
        const userPosts = await usersDb.getUserPosts(req.params.username);
        if (userPosts) {
            res
                .json(userPosts);
        } else {
            res
                .status(400)
                .json({ message: 'No posts from this user.' });
        }
    } catch (err) {
        res
            .status(500)
            .json({ err: 'Posts cannot be retreived at this time.' });
    }
});

module.exports = router;