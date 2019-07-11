const express = require('express');

const Posts = require('./postDb')

const router = express.Router();

//GET all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.get();
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving the posts"
        })
    }
});

//GET specific post
router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.getById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({
            message: "There was an error locating the post."
        })
    }

});

//DELETE a post
router.delete('/:id', validatePostId, async (req, res) => {
    try {
        const count = await Posts.remove(req.params.id)
        res.status(200).json({
            message: `${count} post(s) deleted.`
        })
    } catch (err) {
        res.status(500).json({
            message: "There was an error deleting the post."
        })
    }
});

//PUT a post
router.put('/:id', validatePostId, async (req, res) => {
    try {
        const postContent = {
            text: req.body.text,
            user_id: req.body.user_id
        }
        const update = await Posts.update(req.params.id, postContent)
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({
            message: 'Error updating the post'
        })
    }
});

// custom middleware

async function validatePostId(req, res, next) {
    try {
        const post = await Posts.getById(req.params.id)
        if (post.id == req.params.id) {
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be found."
        })
    }
}

module.exports = router;