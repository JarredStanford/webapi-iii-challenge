const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

//POST new user
router.post('/', validateUser, async (req, res) => {
    try {
        const user = await Users.insert(req.body)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({
            message: "User could not be created."
        })
    }
});

//POST new post by given user
router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    try {
        const postInfo = {
            text: req.body.text,
            user_id: req.user
        }
        const post = await Posts.insert(postInfo)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({
            message: "Post could not be created."
        })
    }
})

//GET all users
router.get('/', async (req, res) => {
    try {
        const users = await Users.get();
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving the users."
        })
    }
});

//GET specific user
router.get('/:id', async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({
            message: "There was an error locating the user."
        })
    }
});

//GET all posts by a user
router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const posts = await Users.getUserPosts(req.user);
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({
            message: "There was an error locating the user's posts."
        })
    }
});

//DELETE a user
router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const count = await Users.remove(req.user)
        res.status(200).json({
            message: `${count} user(s) deleted.`
        })
    } catch (err) {
        res.status(500).json({
            message: "There was an error deleting the user."
        })
    }
});

//PUT a user
router.put('/:id', validateUserId, async (req, res) => {
    try {
        const update = await Users.update(req.user, req.body)
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({
            message: "The user could not be updated."
        })
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const user = await Users.getById(req.params.id)
        if (user.id == req.params.id) {
            req.user = user.id
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: "The user could not be found."
        })
    }
}

function validateUser(req, res, next) {
    Object.keys(req.body).length !== 0
        ? req.body.name
            ? next()
            : res.status(400).json({ message: "missing name data" })
        : res.status(400).json({ message: "missing user data" })
}


function validatePost(req, res, next) {
    Object.keys(req.body).length !== 0
        ? req.body.text
            ? next()
            : res.status(400).json({ message: "missing post content" })
        : res.status(400).json({ message: "missing post data" })
};

module.exports = router;