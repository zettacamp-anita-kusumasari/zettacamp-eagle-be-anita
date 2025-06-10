// *************** IMPORT CORE ***************
const DataLoader = require('dataloader');
const db = require('../../core/database');

// *************** For User data load
const batchUsers = async (ids) => {
  const users = await db.getUsersByIds(ids);
  const userMap = new Map(users.map(user => [user.id, user]));
  return ids.map(id => userMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchUsers;