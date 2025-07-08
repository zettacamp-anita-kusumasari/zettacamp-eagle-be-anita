// *************** IMPORT LIBRARY ***************
const DataLoader = require("dataloader");

// *************** IMPORT MODULE ***************
const BlockModel = require("./Block.model.js");

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

function CreateBlockLoader() {
  // *************** Return DataLoader to BatchSchools
  const toBlockLoader = new DataLoader(BatchBlocks);
  return toBlockLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateBlockLoader;
