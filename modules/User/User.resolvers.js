// *************** IMPORT CORE ***************
const User = require('./User.model');

const resolvers = {
  Query: {
    // *************** To fetch all users
    GetAllUsers: async () => await User.find({}),

    // *************** To fetch a single user by ID
    GetOneUser: async (_, { id }) => await User.findById(id),
  },

  Mutation: {
    // *************** Create a new user with provided args (arguments/parameters)
    createUser: async (_, args) => {
      const user = new User(args);
      return await user.save();
    },

    // *************** Update user by ID, returning the updated document
    updateUser: async (_, { id, ...updates }) => {
      return await User.findByIdAndUpdate(id, updates, { new: true });
    },

    // *************** Soft delete a user by setting deletedAt to current date
    deleteUser: async (_, { id }) => {
      return await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;