const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
require("chai").should()

// If not on a development chain
!developmentChains.includes(network.name)
  ? describe.skip // skip this test, otherwise...
  : describe("DappTokenCrowdsale Unit Tests", async function () {
      let deployer, safekeeper, DappToken, dapptokencrowdsale

      beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        safekeeper = accounts[1]

        /* Deploy token */
        await deployments.fixture("dapptoken")
        DappToken = await ethers.getContract("DappToken")

        /* Deploy crowdsale */
        const DappTokenCrowdsale = await hre.ethers.getContractFactory("DappTokenCrowdsale")
        dapptokencrowdsale = await DappTokenCrowdsale.deploy(
          1500, // rate, how many tokens per eth
          safekeeper.address, // wallet
          DappToken.address // ERC20 token address
        )
        await dapptokencrowdsale.deployed()
      })
      describe("Deploy", function () {
        it("tracks the rate", async function () {
          const token = await dapptokencrowdsale.rate()
          token.should.equal(1500)
        })
        it("tracks the safekeeper wallet", async function () {
          const token = await dapptokencrowdsale.wallet()
          token.should.equal(safekeeper.address)
        })
        it("tracks the token", async function () {
          const token = await dapptokencrowdsale.token()
          token.should.equal(DappToken.address)
        })
      })
    })
