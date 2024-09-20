
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema
({
  
  username: { type: String, minlength:5,maxlength:20 ,required: true},
      title: {  type: String,maxlength:30,required: true,unique:true },
    content: {type:String, required: true,
               image: {
                            type: String, // You can store URL or file path of the image
                            default: null
                           },
                video: {
                            type: String, // You can store URL or file path of the video
                            default: null
                          }
              },
    createdAt: {  type: Date, default: Date.now},
    updatedAt: {  type: Date,default: Date.now}

});

module.exports= mongoose.model('post_login_schema', postSchema)

