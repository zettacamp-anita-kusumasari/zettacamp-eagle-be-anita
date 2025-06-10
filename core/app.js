// *************** IMPORT CORE ***************
const express = require('express');
const app = express();
const connectDB = require('./database');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const schoolTypeDefs = require('../modules/School/School.typeDefs.js');
const studentTypeDefs = require('../modules/Student/Student.typeDefs.js');
const userTypeDefs = require('../modules/User/User.typeDefs.js');
const schoolResolvers = require('../modules/School/School.resolvers.js');
const studentResolvers = require('../modules/Student/Student.resolvers.js');
const userResolvers = require('../modules/User/User.resolvers.js');

// *************** Get the MONGODB_URI value from environment
const MONGODB_URI = process.env.MONGODB_URI;

// *************** Setup PORT Value from Environment
const PORT = process.env.PORT || 4000;

// ****************** Calling the connectDB to connect the app with the MongoDB database
connectDB(MONGODB_URI);

// *************** Async function to start Apollo Server and integrate it with Express app
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: [schoolTypeDefs, studentTypeDefs, userTypeDefs],
    resolvers: [schoolResolvers, studentResolvers, userResolvers],
  });

  // *************** Start the Apollo server
  await server.start();

  // *************** Apply Apollo middleware to Express app
  server.applyMiddleware({ app });

  // *************** Start the Express server
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// *************** Invoke the function to launch server
startApolloServer();