const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
require("chai").should()

// If not on a development chain
!developmentChains.includes(network.name)
  ? describe.skip // skip this test, otherwise...
  : describe("DappToken Unit Tests", async function () {
      let deployer, DappToken

      beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture("dapptoken")
        DappToken = await ethers.getContract("DappToken")
      })
      describe("Deploy", function () {
        it("initializes with correct name and symbol", async function () {
          const name = await DappToken.name()
          const symbol = await DappToken.symbol()
          name.should.equal("DappToken")
          symbol.should.equal("DT")
        })
        it("initializes with the correct decimals", async function () {
          const decimals = await DappToken.decimals()
          decimals.should.equal(18)
        })
      })
      describe("Functions", function () {
        it("Total Supply starts at 0", async function () {
          const totalSupply = await DappToken.totalSupply()
          // Typecasting totalSupply bigNumber value to compare
          Number(totalSupply).should.equal(0)
        })
        it("Mint adds to Total Supply", async function () {
          const afterMint = await DappToken.mint(deployer.address, 2)
          const totalSupply = await DappToken.totalSupply()
          Number(totalSupply).should.equal(2)
        })
      })
    })
