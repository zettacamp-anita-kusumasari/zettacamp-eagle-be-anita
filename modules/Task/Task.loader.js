// *************** IMPORT LIBRARY ***************
const DataLoader = require("dataloader");

// *************** IMPORT MODULE ***************
const TaskModel = require("./Task.model.js");

/**
 * Batch function to fetch multiple tasks by their IDs and return them in the same order.
 *
 * @param {Array<string | import("mongoose").Types.ObjectId>} ids - Array of task IDs to fetch.
 * @returns {Promise<Array<Object|null>>} A promise that resolves to an array of task objects
 * ordered to match the input IDs. Returns `null` if a task is not found.
 */
async function BatchTasks(ids) {
  // *************** Fetch tasks matching the given IDs
  const tasks = await TaskModel.find({ _id: { $in: ids } }).lean();
  // *************** Map task ID to test object
  const taskMap = new Map();
  // *************** Store each task in the map with its ID as the key
  tasks.forEach((task) => {
    taskMap.set(String(task._id), task);
  });
  // *************** Return tasks in the same order as input IDs
  const OrderedTasks = ids.map((id) => taskMap.get(String(id)) || null);
  return OrderedTasks;
}

/**
 * Creates a DataLoader instance for batching and caching task lookups by ID.
 *
 * @returns {DataLoader<string | import("mongoose").Types.ObjectId, Object|null>}
 * A DataLoader that batches and caches task fetches by ID. Returns `null` for missing tasks.
 */
function CreateTaskLoader() {
  // *************** Return DataLoader to BatchTasks
  const TaskLoader = new DataLoader(BatchTasks);
  return TaskLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateTaskLoader;
