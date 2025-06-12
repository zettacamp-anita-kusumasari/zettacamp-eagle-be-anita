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

// *************** LOADER ***************
const DataLoader = require('dataloader');
const batchUsers = require('../modules/User/User.loader.js');
const batchSchools = require('../modules/School/School.loader.js');
const batchStudents = require('../modules/Student/Student.loader.js');

// *************** Get the MONGODB_URI (Uniform Resource Identifier) value from environment
const MONGODB_URI = process.env.MONGODB_URI;

// *************** Setup PORT Value from Environment
const PORT = process.env.PORT || 4000;

// ****************** Calling the connectDB to connect the app with the MongoDB database
connectDB(MONGODB_URI);

/**
 * Asynchronously starts an Apollo Server instance and integrates it with the Express application.
 *
 * This function initializes the Apollo Server with the defined GraphQL type definitions and resolvers
 * for schools, students, and users. It also sets up the context with DataLoaders for batching and caching
 * database requests efficiently.
 *
 * The `context` provides:
 * - `userLoader`: A DataLoader for batching user data requests.
 * - `schoolLoader`: A DataLoader for batching school data requests.
 * - `studentLoader`: A DataLoader for batching student data requests.
 *
 * @async
 * @function startApolloServer
 * @returns {Promise<void>} A promise that resolves once the Apollo Server is successfully started.
 */
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: [schoolTypeDefs, studentTypeDefs, userTypeDefs],
    resolvers: [schoolResolvers, studentResolvers, userResolvers],
    context: () => ({
      userLoader: new DataLoader(batchUsers),
      schoolLoader: new DataLoader(batchSchools),
      studentLoader: new DataLoader(batchStudents),
    }),
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

// *************** Call the function to launch server
startApolloServer();