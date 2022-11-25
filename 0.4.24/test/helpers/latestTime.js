const { ethers } = require("hardhat")

async function latestTime() {
  const blockNumBefore = await ethers.provider.getBlockNumber()
  const blockBefore = await ethers.provider.getBlock(blockNumBefore)
  const timestampBefore = blockBefore.timestamp
  return timestampBefore
}

module.exports = {
  latestTime,
}
