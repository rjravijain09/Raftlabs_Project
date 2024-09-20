// routes/post_login_routes
const express = require('express');
const router = express.Router();
const postSchema = require('../models/post_login_schema');
const logger = require('../../logger'); 

// Create a post
router.post('/blogs', async (req, res) => {
    try {
        const post = new postSchema(req.body);
        await post.save();
        logger.info('Blog created successfully.');
        res.status(201).json({ message: 'Blog Created.' });
    } catch (error) {
        logger.error(`Blog creation error: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all posts
router.get('/blogs', async (req, res) => {
    try {
        const result = await postSchema.find();
        logger.info('Fetched all blogs successfully.');
        res.status(200).send(result);
    } catch (error) {
        logger.error(`Error fetching blogs: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get by username
router.get('/blogs/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const result = await postSchema.find({ username: username });
        if (result.length > 0) {
            logger.info(`Fetched blogs for user: ${username}`);
            res.status(200).send(result);
        } else {
            logger.warn(`No posts available for user: ${username}`);
            res.status(404).json({ message: 'No posts available.' });
        }
    } catch (error) {
        logger.error(`Error fetching posts for user ${username}: ${error.message}`);
        res.status(500).send(error);
    }
});

// Get by title
router.get('/blogs/:username/:title', async (req, res) => {
    const { username, title } = req.params;
    try {
        const result = await postSchema.findOne({ username: username, title: title });
        if (result) {
            logger.info(`Fetched post titled "${title}" for user: ${username}`);
            res.status(200).send(result);
        } else {
            logger.warn(`No post found titled "${title}" for user: ${username}`);
            res.status(404).json({ message: 'No post available.' });
        }
    } catch (error) {
        logger.error(`Error fetching post titled "${title}" for user ${username}: ${error.message}`);
        res.status(500).send(error);
    }
});

// Update a post using patch
router.patch('/blogs/:username/:title', async (req, res) => {
    const { username, title } = req.params;
    try {
        const result = await postSchema.findOneAndUpdate(
            { username: username, title: title },
            req.body,
            { new: true }
        );
        if (result) {
            logger.info(`Post titled "${title}" updated for user: ${username}`);
            res.status(200).send(result);
        } else {
            logger.warn(`No post found to update titled "${title}" for user: ${username}`);
            res.status(404).json({ message: 'No post available to update.' });
        }
    } catch (error) {
        logger.error(`Error updating post titled "${title}" for user ${username}: ${error.message}`);
        res.status(500).send(error);
    }
});

// Delete a post
router.delete('/blogs/:username/:title', async (req, res) => {
    const { username, title } = req.params;
    try {
        const result = await postSchema.findOneAndDelete({ username: username, title: title });
        if (result) {
            logger.info(`Post titled "${title}" deleted for user: ${username}`);
            res.status(200).json(result);
        } else {
            logger.warn(`No post found to delete titled "${title}" for user: ${username}`);
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        logger.error(`Error deleting post titled "${title}" for user ${username}: ${error.message}`);
        res.status(500).send(error);
    }
});

module.exports = router;
