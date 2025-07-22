// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose');

/**
 * Asynchronously connects to a MongoDB database using the URI specified
 * in the environment variable `MONGODB_URI`, or defaults to a local instance.
 *
 * On successful connection, logs the host and database name.
 * If the connection fails, logs the error and exits the process with code 1.
 *
 * @async
 * @function ConnectDB
 * @returns {Promise<void>} A promise that resolves when the connection is successful,
 * or the process exits on failure.
 */
async function ConnectDB(){
  try {
    // *************** Get the MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zettacamp';
    // *************** Attempt to connect to MongoDB using Mongoose
    const connecting = await Mongoose.connect(mongoURI);
    // *************** Log successful connection details (host and database name)
    console.log(`MongoDB Connected: ${connecting.connection.host}/${conn.connection.name}`);
  } catch (error) {
    // *************** Log connection error message and exit the process with failure code
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// *************** EXPORT MODULE ***************
module.exports = ConnectDB;