// *************** IMPORT CORE ***************
const User = require('./User.model.js');

// *************** To fetch all users
async function getAllUsers() {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// *************** To fetch a single user by ID
async function getOneUser(_, { id }) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// *************** Create a new user with provided arguments
async function createUser (_, args) {
  try {
    const user = new User(args);
    return await user.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// *************** Update user by ID, returning the updated document
async function updateUser(_, { id, ...updates }) {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// *************** Soft delete a user by setting deletedAt to current date
async function deleteUser(_, { id }) {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// *************** EXPORT MODULE ***************
module.exports = getAllUsers, getOneUser, createUser, updateUser, deleteUser;