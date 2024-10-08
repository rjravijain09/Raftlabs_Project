const express = require('express');   
const app = express();
require('dotenv').config();
const router = require('./src/routes/log_routes');
const post_login_routes = require('./src/routes/post_login_routes');
const  Schema = require('./src/models/login_schema');
const post_login_schema= require('./src/models/post_login_schema');
const PORT =process.env.PORT|| 5000 ; 
const logger = require('./logger');
const SECRET_KEY = 'secret_key';
const bcrypt = require('bcrypt');
app.use("/", express.static(__dirname + "/public" ));
const mongoose = require('mongoose');

/////////////////////////////////////////////////middleware
app.use(express.json());

////////////////////////////////////////////////routes
app.use('/',router);
app.use('/',post_login_routes);
/////////////////////////////////////////////// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});

/////////////////////////////////////////////////MONGODB CONNECTION////////////////////////////////////////////////////


// mongoose.connect(process.env.MONGO_URI)
//   .then(() =>  logger.info('MongoDB connected at ' + process.env.MONGO_URI)
//                        
//   .catch(err => console.error('MongoDB connection error:', err));
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const message = 'MongoDB connected at ' + process.env.MONGO_URI;
    logger.info(message);
    console.log(message); // Log to console
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    console.log('MongoDB connection error:', err); 
  });