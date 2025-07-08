// *************** IMPORT LIBRARY ***************
const DataLoader = require("dataloader");

// *************** IMPORT MODULE ***************
const BlockModel = require("./Block.model.js");

/**
 * Batch fetch Block documents by an array of IDs and return them in the same order as the input IDs.
 *
 * @async
 * @function
 * @param {Array<string|import('mongoose').Types.ObjectId>} ids - Array of Block document IDs.
 * @returns {Promise<Array<Object|null>>} A Promise that resolves to an array of Block objects in the same order as `ids`.
 * If a block ID does not exist, `null` will be returned in its place.
 */
async function BatchBlocks(ids) { 
  // *************** Fetch blocks matching the given IDs
  const blocks = await BlockModel.find({ _id: { $in: ids } }).lean();
  // *************** Map block ID to block object
  const blockMap = new Map();
  // *************** Store each block in the map with its ID as the key
  blocks.forEach(function (block) {
    blockMap.set(String(block._id), block);
  });
  // *************** Return blocks in the same order as input IDs
  const toOrderedBlocks = ids.map((id) => blockMap.get(String(id)));
  return toOrderedBlocks;
}

/**
 * Creates a DataLoader instance for batching and caching Block document retrieval.
 *
 * @function
 * @returns {import('dataloader')} A DataLoader instance for loading Blocks by ID.
 */
function CreateBlockLoader() {
  // *************** Return DataLoader to BatchSchools
  const toBlockLoader = new DataLoader(BatchBlocks);
  return toBlockLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateBlockLoader;
