const StoragePlatform = artifacts.require("StoragePlatform");

module.exports = async function (deployer) {
  const initialSupply = web3.utils.toWei("1000000", "ether"); // Initial supply in tokens (1 million tokens)
  const rewardRate = 10; // Reward rate: 10 tokens per GB of storage

  await deployer.deploy(StoragePlatform, initialSupply, rewardRate);
};
