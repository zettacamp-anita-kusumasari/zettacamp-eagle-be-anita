// *************** IMPORT CORE ***************
const User = require('./User.model');

const resolvers = {
  Query: {
    // *************** To fetch all users
    users: async () => await User.find({}),

    // *************** To fetch a single user by ID
    user: async (_, { id }) => await User.findById(id),
    // *************** To load the data using dataloader
    user: (_, { id }) => userLoader.load(id),
    // *************** To load many data using dataloader
    users: (_, { ids }) => userLoader.loadMany(ids),
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