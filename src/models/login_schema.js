
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, minlength:5,maxlength:20 ,required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, minlength:5, required: true }
});

module.exports= mongoose.model('login_schema', userSchema);




