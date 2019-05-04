const express = require('express');
const postDb = require('../database/helpers/postsDb');
const router = express.Router();

// Gets listing of all posts
router.get('/', async(req, res) => {
    try {
        const posts = await postDb.get();
        res
            .json(posts);
    } catch (err) {
        res
            .status(500)
            .json({ err: "The information requested cannot be retreived." });
    }
});

// Gets listing by Id with comments
router.get('/:id', async(req, res) => {
    try {
        const posts = await postDb.getPostComment(req.params.id);
        if (posts) {
            res
                .json(posts);
        } else {
            res
                .status(404)
                .json({ message: "The post with that Id does not exist." });
        }
    } catch (err) {
        res
            .status(500)
            .json({ err: "The post information cannot be retreived." });
    }
});

// Adds new family post
router.post('/', async(req, res) => {
    const { family_id, 
            attraction,
            num_of_children,
            meetup_time,
            meetup_date, 
            message } = req.body
    if (!family_id || !attraction || !num_of_children || !meetup_time || !meetup_date || !message)  {
        res
            .status(400)
            .json({ message: "Please provide missing information" });
    }
    try {
        const posts = await postDb.add(req.body);
        res
            .json(posts);
    } catch (err) {
        res
            .status(500)
            .json({ err: "The post could not be added at this time." });
    }
});

// Updates a post
router.put('/:id', async(req, res) => {
    try {
        const updatePost = await postDb.update(req.params.id, req.body);
        if (req.params.id && req.body) {
            if (updatePost) {
                res
                    .status(200)
                    .json({ message: "Your post has been successfully updated!" });
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified Id does not exist." });
            }
        } else {
            res
                .status(400)
                .json({ message: "Please provide user id and content for the post." });
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
        const posts = await postDb.remove(req.params.id);
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