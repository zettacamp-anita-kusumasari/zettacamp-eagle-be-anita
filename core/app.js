// *************** IMPORT CORE ***************
const express = require('express');
const app = express()
require('dotenv').config()
const connectDB = require('./database');

// *************** Get the MONGODB_URI value from environment
const MONGODB_URI = process.env.MONGODB_URI;

// *************** Setup PORT Value from Environment
const PORT = process.env.PORT || 4000;

// ****************** Calling the connectDB to connect the app with the MongoDB database
connectDB(MONGODB_URI);

// ****************** Starting the server on the PORT (4000)
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// *************** Route that checks whether the server is running properly or not
app.get('/', (_, res) => {
    res.send(`app is running on PORT ${PORT}`);
});