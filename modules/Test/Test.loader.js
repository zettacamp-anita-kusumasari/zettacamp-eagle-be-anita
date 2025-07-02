// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const TestModel = require('./Test.model.js');

async function BatchTests(ids) {
  // *************** Fetch tests matching the given IDs
  const tests = await TestModel.find({ _id: { $in: ids } });
  // *************** Map test ID to test object
  const testMap = new Map();
  // *************** Store each test in the map with its ID as the key
  for (const test of tests) {
    testMap.set(String(test._id), test);
  }
  // *************** Return tests in the same order as input IDs
  const toOrderedTests = ids.map(id => testMap.get(String(id)));
  return toOrderedTests;
}

function CreateTestLoader() {
  // *************** Return DataLoader to BatchTests
  const toTestLoader = new DataLoader(BatchTests);
  return toTestLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateTestLoader;
