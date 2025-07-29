// *************** IMPORT CORE ***************
const ConnectDB = require('./core/database.js');

// *************** IMPORT MODULE ***************
const Resolvers = require('./core/resolvers.js');
const TypeDefs = require('./core/typeDefs.js');

// *************** IMPORT LIBRARY ***************
const Express = require('express');
const Dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');

// *************** LOADER ***************
const Loaders = require('./core/loaders.js');

// *************** Initialize the Express application
const index = Express();

// *************** Load environment variables from .env file into process.env
Dotenv.config();

// *************** Get the MONGODB_URI (Uniform Resource Identifier) value from Environment
const MONGODB_URI = process.env.MONGODB_URI;

// *************** Setup PORT Value from Environment
const PORT = process.env.PORT || 4000;

// ****************** Calling the ConnectDB to connect the index with the MongoDB database
ConnectDB();

/**
 * Starts the Apollo Server with provided type definitions, resolvers, and context (including DataLoaders).
 *
 * @async
 * @function StartApolloServer
 * @returns {Promise<void>} A promise that resolves when the Apollo Server has started successfully.
 */
async function StartApolloServer() {
  // ****************** Create a new Apollo Server instance with type definitions, resolvers, and context
  const server = new ApolloServer({
    typeDefs: TypeDefs,
    resolvers: Resolvers,
    context: Loaders
  });

  // *************** Start the Apollo server
  await server.start();

  // *************** Apply Apollo middleware to Express application (index)
  server.applyMiddleware({ index });

  // *************** Start the Express server
  index.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// *************** Call the function to launch server
StartApolloServer();