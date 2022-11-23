require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("@nomicfoundation/hardhat-chai-matchers")
require("dotenv").config()
require("hardhat-deploy")

const PRIVATE_KEY = process.env.PRIVATE_KEY

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

// If you're experiencing issues with Goerli...
//  you can configure Polygon's testnet Mumbai to play. DYOR
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || ""
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      blockConfirmations: 6,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    mumbai: {
      chainId: 80001,
      blockConfirmations: 6,
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  solidity: "0.4.24",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
}
