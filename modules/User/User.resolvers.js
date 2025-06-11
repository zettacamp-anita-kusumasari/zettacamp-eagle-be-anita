// *************** IMPORT HELPER FUNCTION ***************
const getAllUsers = require('./User.helper.js');
const getOneUser = require('./User.helper.js');
const createUser = require('./User.helper.js');
const updateUser = require('./User.helper.js');
const deleteUser = require('./User.helper.js');

const resolvers = {
  // *************** QUERY ***************
  Query: {
    getAllUsers, getOneUser,
  },

  // *************** MUTATION ***************
  Mutation: {
    createUser, updateUser, deleteUser,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;