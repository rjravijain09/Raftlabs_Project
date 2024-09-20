// routes/post_login_routes
const express = require('express');
const router = express.Router();
const postSchema = require('../models/post_login_schema');
const logger = require('../../logger'); 

// Create  post
router.post('/blogs', async (req, res) => {
    try {
        const post = new postSchema(req.body);
        await post.save()
        .then((result) => {
            if (result) {
                res.status(201).json({ message: 'Blog Created..' });
            };
        }) 
        .catch((error) =>{
         res.status(400).json(error);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});


// Get all posts
router.get('/blogs', async (req, res) => {
    try {
         const result=await postSchema.find()
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            };
        }) 
        .catch((error) =>{
         res.status(400).json(error);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get by username
router.get('/blogs/:username', async(req,res)=>{
    const username = req.params.username;
 try{
    await postSchema.find({username:username})
    .then((result) => {
        if (result) {
            res.status(200).send(result);
        }else{
            res.status(200),json({message:'No any Post available.'});
        }
    }) 
    .catch((error) =>{
     res.status(400).json(error);
    });
 }catch(error){
    res.status(500).send(error);
 }
});


//Get by title
router.get('/blogs/:username/:title', async(req,res)=>{
    const username = req.params.username;
    const title = req.params.title;
 try{
    await postSchema.findOne({username:username,title:title})
    .then((result) => {
        if (result) {
            res.status(200).send(result);
        }else{
            res.status(200),json({message:'No Post available.'});
        }
    }) 
    .catch((error) =>{
     res.status(400).json(error);
    });
 }catch(error){
    res.status(500).send(error);
 }
});


// Update a post using patch
router.patch('/blogs/:username/:title', async (req, res) => {
    try {
       await postSchema.findOneAndUpdate({username:req.params.username,title:req.params.title},req.body,{new:true})
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            };
        }) 
        .catch((error) =>{
         res.status(400).json(error);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});



// Delete a post
router.delete('/blogs/:username/:title', async (req, res) => {
    try {
        await postSchema.findOneAndDelete({username:req.params.username,title:req.params.title})
         .then((result) => {
            if (result) {
                res.status(200).json(result);
            }else{
                res.status(400).json({message:'not found'});
            }
             }) 
             .catch((error) =>{
            res.status(400).json(error);
         });
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;