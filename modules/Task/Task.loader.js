// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const TaskModel = require('./Task.model.js');

async function BatchTasks(ids) {
  // *************** Fetch tasks matching the given IDs
  const tasks = await TaskModel.find({ _id: { $in: ids } });
  // *************** Map task ID to test object
  const taskMap = new Map();
  // *************** Store each task in the map with its ID as the key
  for (const task of tasks) {
    taskMap.set(String(task._id), task);
  }
  // *************** Return tasks in the same order as input IDs
  const toOrderedTasks = ids.map(id => taskMap.get(String(id)));
  return toOrderedTasks;
}

function CreateTaskLoader() {
  // *************** Return DataLoader to BatchTasks
  const toTaskLoader = new DataLoader(BatchTasks);
  return toTaskLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateTaskLoader;