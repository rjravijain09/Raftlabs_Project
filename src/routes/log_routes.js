
const express = require('express');
const router = express.Router();
const  Schema = require('../models/login_schema');
const bcrypt = require('bcrypt');
const saltrounds =10;
const logger = require('../../logger');

////////////////////////////////////mock database
const users = [ ];

/////////////////////////////////////////////////////////////////// SINGUP/////////////////////////////////////////////////////////////
router.post('/signup',async (req, res) => { 
   
    const { username,email,password } = req.body;
    console.log("username");

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please Provide username, email, and password.' });
    }
    try {
        const salt= await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,salt);
 //////////////////////// Check if the user already exists
 const existingUser = await Schema.findOne({ email: email });
 if (existingUser) {
     return res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
 }

///////////////////////////////////store the user
const newUser = new Schema({ username, email, password:hashPassword });
console.log({"username":username,"email":email,"password":password,"hashPassword":hashPassword});
newUser.save()
.then((result) => {
    if (result) {
        res.status(201).json({ message: 'User registered successfully!', });
    };
}) 
.catch((error) =>{
 res.status(400).json(error);
});

} catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
}
});


/////////////////////////////////////////////////////////////LOGIN/////////////////////////////////////////////////////////

router.post('/login', async (req, res) => { 
    const { username, password } = req.body;

    try{
    const user= await Schema.findOne({username:username });
   
    if (!user) {
        return res.status(404).json({ message: "Invalid username.." });
    }
    
    console.log("stord Hashed password:", user.password);
    
    const salt= await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    console.log("input of hash:",hashPassword);
    console.log("input password:", password);
   const passwordMatch= await bcrypt.compare(password,user.password);

 ///////////////////////////////comparing password
    if(!passwordMatch){
        return res.status(400).json({message:"invalid password"});
      }
      else{
        console.log("password match:");
      }

    res.status(200).json({message:"LogIn Successful"});

}catch (error){
    console.log(error);
    res.status(500).json(error);
}
});


///////////////////////////////////////////////////////////////////////GET USERS BY ID/////////////////////////////////////////////////

router.get('/signup/:username', async (req, res) => {
    const userId = req.params.username;

    try {
        const user = await Schema.findOne({username:userId});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get('/login/:username', async (req, res) => {
    const userId = req.params.username;

    try {
        const user = await Schema.findOne({username:userId});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Read all Registered Users
router.get('/signup', async (req, res) => {
    await Schema.find().then((result) => {
        if (result) {
            res.status(200).send(result);
        };
        
    }) 
    .catch((error) =>{
     res.status(404).send(error);
        
    });
});


// Delete a Users by ID
router.delete('/signup/:username', (req, res) => {
    const postId = req.params.username;
    Schema.findOneAndDelete({username:postId}).then((result) => {
        if (result) {
            res.status(200).send(result);
        }else{
        res.status(404).json({message:' User Not Found'});
        }
    })
    .catch((error) =>{
        res.status(500).send(error);
    }) ;
    });


  module.exports = router ;
