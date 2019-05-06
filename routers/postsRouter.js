const express = require('express');

const postsDb = require('../database/helpers/postsDb');

const router = express.Router();

// GET ALL POSTS
router.get('/', async(req, res) => {
    try {
        const posts = await postsDb.get();
        res
            .json(posts);
    } catch (err) {
        res
            .status(500)
            .json({ err: "The information requested cannot be retreived." });
    }
});

// GET POSTS BY ID
router.get('/:id', async(req, res) => {
    try {
        const posts = await postsDb.getPostComment(req.params.id);
        if (posts) {
            res
                .json(posts);
        } else {
            res
                .status(404)
                .json({ message: "The post with that ID does not exist." });
        }
    } catch (err) {
        res
            .status(500)
            .json({ err: "The post information cannot be retreived." });
    }
});

// CREATE NEW POST
router.post('/', async(req, res) => {
    const { users_id, 
            post_title,
            post_body } = req.body
    if (!users_id || !post_title || !post_body )  {
        res
            .status(400)
            .json({ message: "Please provide missing information" });
    }
    try {
        const posts = await postsDb.add(req.body);
        res
            .json(posts);
    } catch ({ message }) {
        res
            .status(500)
            .json({ message });
    }
});

// Updates a post
router.put('/:id', async(req, res) => {
    try {
        const updatePost = await postsDb.update(req.params.id, req.body);
        if (req.params.id && req.body) {
            if (updatePost) {
                res
                    .status(200)
                    .json({ message: "Your post has been successfully updated!" });
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            }
        } else {
            res
                .status(400)
                .json({ message: "Please provide user ID and content for the post." });
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "The post information could not be modified." });
    }
});

// Deleting a post
router.delete('/:id', async(req, res) => {
    try {
        const posts = await postsDb.remove(req.params.id);
        if (posts) {
            res
                .json({ message: "Your post has been successfully removed." });
        } else {
            res
                .status(404)
                .json({ message: "The post with specified id does not exist." });
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "The post could not be removed at this time." });
    }
});

module.exports = router;