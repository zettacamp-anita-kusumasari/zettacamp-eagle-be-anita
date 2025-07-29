// *************** IMPORT LIBRARY ***************
const DataLoader = require("dataloader");

// *************** IMPORT MODULE ***************
const TestModel = require("./Test.model.js");

/**
 * Batch function to fetch multiple tests by their IDs and return them in the same order.
 *
 * @param {Array<string | import("mongoose").Types.ObjectId>} ids - Array of test IDs to fetch.
 * @returns {Promise<Array<Object|null>>} A promise that resolves to an array of test objects
 * in the same order as the input IDs. Returns `null` for missing tests.
 */
async function BatchTests(ids) {
  // *************** Fetch tests matching the given IDs
  const tests = await TestModel.find({ _id: { $in: ids } }).lean();
  // *************** Map test ID to test object
  const testMap = new Map();
  // *************** Store each test in the map with its ID as the key
  tests.forEach((test) => {
    testMap.set(String(test._id), test);
  });
  // *************** Return tests in the same order as input IDs
  const OrderedTests = ids.map((id) => testMap.get(String(id)) || null);
  return OrderedTests;
}

/**
 * Creates a DataLoader instance for batching and caching test lookups by ID.
 *
 * @returns {DataLoader<string | import("mongoose").Types.ObjectId, Object|null>}
 * A DataLoader that batches and caches test fetches by ID. Returns `null` if a test is not found.
 */
function CreateTestLoader() {
  // *************** Return DataLoader to BatchTests
  const TestLoader = new DataLoader(BatchTests);
  return TestLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateTestLoader;
