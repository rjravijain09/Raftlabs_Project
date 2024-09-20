const express = require('express');
const router = express.Router();
const Schema = require('../models/login_schema');
const bcrypt = require('bcrypt');
const logger = require('../../logger'); 

////////////////////////////////////mock database
const users = [];

/////////////////////////////////////////////////////////////////// SIGNUP /////////////////////////////////////////////////////////////
router.post('/signup', async (req, res) => { 
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        logger.warn('Signup attempt with missing fields');
        return res.status(400).json({ message: 'Please Provide username, email, and password.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Check if the user already exists
        const existingUser = await Schema.findOne({ email: email });
        if (existingUser) {
            logger.warn(`Signup failed: Email already registered - ${email}`);
            return res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
        }

        // Store the user
        const newUser = new Schema({ username, email, password: hashPassword });
        logger.info(`Registering new user: ${username}`);

        await newUser.save();
        logger.info(`User registered successfully: ${username}`);
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        logger.error(`Signup error: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

///////////////////////////////////////////////////////////// LOGIN ///////////////////////////////////////////////////////////
router.post('/login', async (req, res) => { 
    const { username, password } = req.body;

    try {
        const user = await Schema.findOne({ username: username });
        
        if (!user) {
            logger.warn(`Login failed: Invalid username - ${username}`);
            return res.status(404).json({ message: "Invalid username.." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn(`Login failed: Invalid password for username - ${username}`);
            return res.status(400).json({ message: "Invalid password" });
        }

        logger.info(`User logged in successfully: ${username}`);
        res.status(200).json({ message: "LogIn Successful" });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/////////////////////////////////////////////////////////////////////// GET USERS BY ID ////////////////////////////////////////////////
router.get('/signup/:username', async (req, res) => {
    const userId = req.params.username;

    try {
        const user = await Schema.findOne({ username: userId });
        if (!user) {
            logger.warn(`User not found: ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        res.status(500).send(error);
    }
});

// Read all Registered Users
router.get('/signup', async (req, res) => {
    try {
        const users = await Schema.find();
        res.status(200).send(users);
    } catch (error) {
        logger.error(`Error fetching all users: ${error.message}`);
        res.status(404).send(error);
    }
});

// Delete a User by ID
router.delete('/signup/:username', async (req, res) => {
    const postId = req.params.username;

    try {
        const result = await Schema.findOneAndDelete({ username: postId });
        if (result) {
            logger.info(`User deleted successfully: ${postId}`);
            res.status(200).send(result);
        } else {
            logger.warn(`Delete failed: User not found - ${postId}`);
            res.status(404).json({ message: 'User Not Found' });
        }
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        res.status(500).send(error);
    }
});

module.exports = router;
