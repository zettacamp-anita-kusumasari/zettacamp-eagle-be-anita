// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

/**
 * Asynchronously connects to a MongoDB database using the URI specified
 * in the environment variable `MONGODB_URI`, or defaults to a local instance.
 *
 * On successful connection, logs the host and database name.
 * If the connection fails, logs the error and exits the process with code 1.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when the connection is successful,
 * or the process exits on failure.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zettacamp';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// *************** EXPORT MODULE ***************
module.exports = connectDB;