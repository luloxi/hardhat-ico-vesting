const { expect, assert } = require("chai")
require("chai").should()
const { deployments, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
// require("../../node_modules/openzeppelin-solidity/test/helpers/latestTime")
const { latestTime } = require("../helpers/latestTime") // Ethers version by me
// require("../../node_modules/openzeppelin-solidity/test/helpers/increaseTime")
const { duration, increaseTimeTo } = require("../helpers/increaseTime") // Ethers version by me

// If not on a development chain
!developmentChains.includes(network.name)
  ? describe.skip // skip this test, otherwise...
  : describe("DappTokenCrowdsale Unit Tests", async function () {
      let deployer, safekeeper, investor1, investor2
      let DappToken, dapptokencrowdsale

      const oneEther = ethers.utils.parseEther("1.0")
      const investorMinCap = ethers.utils.parseUnits("0.002", 18)
      const investorHardCap = ethers.utils.parseUnits("50", 18)

      beforeEach(async function () {
        ;[deployer, safekeeper, investor1, investor2] = await ethers.getSigners()

        /* Deploy token */
        await deployments.fixture("dapptoken")
        DappToken = await ethers.getContract("DappToken")

        /* Deploy crowdsale */
        const _rate = 1500
        const _wallet = safekeeper.address
        const _token = DappToken.address
        const _cap = ethers.utils.parseUnits("100", 18)
        const _openingTime = (await latestTime()) + duration.weeks(1)
        const _closingTime = _openingTime + duration.weeks(1)
        const _goal = ethers.utils.parseUnits("50", 18)

        const DappTokenCrowdsale = await hre.ethers.getContractFactory("DappTokenCrowdsale")
        dapptokencrowdsale = await DappTokenCrowdsale.deploy(
          _rate, // rate, how many tokens per eth
          _wallet, // wallet
          _token, // ERC20 token address
          _cap, // Max amount of eth to be invested in the crowdsale
          _openingTime, // Crowdsale starts 1 week from now
          _closingTime, // Ends 1 week after it started
          _goal // Minimum amount of ETH to raise, otherwaise refund gets triggered
        )
        await dapptokencrowdsale.deployed()

        // Transfer token ownership to crowdsale to grant minting permission
        await DappToken.transferOwnership(dapptokencrowdsale.address)

        // Add investors to whitelist
        await dapptokencrowdsale.addManyToWhitelist([deployer.address, investor1.address])
        // This one works for version 1.11.0 and above of openzeppelin-solidity dependency
        // await dapptokencrowdsale.addAddressesToWhitelist([deployer.address, investor1.address])

        // Increase time so the crowdsale is open
        await increaseTimeTo(_openingTime + 1)
      })
      describe("Deploy", function () {
        it("tracks the rate", async function () {
          const token = await dapptokencrowdsale.rate()
          Number(token).should.equal(1500)
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

      describe("Accepting payments", function () {
        it("starts the contract with 0 ETH", async function () {
          const startingBalance = await ethers.provider.getBalance(dapptokencrowdsale.address)
          expect(Number(startingBalance)).to.equal(0)
        })
        xit("should accept payments through receive function", async function () {
          // Crowdsale forwards received ETH to safekeeper wallet
          const startingBalance = await ethers.provider.getBalance(safekeeper.address)
          const transactionHash = await deployer.sendTransaction({
            to: dapptokencrowdsale.address,
            value: oneEther,
          })
          const updatedBalance = await ethers.provider.getBalance(safekeeper.address)
          expect(Number(updatedBalance)).to.equal(Number(startingBalance) + Number(oneEther))
        })
      })
      describe("Minted Crowdsale", function () {
        it("mints tokers after purchasing them for a beneficiary", async function () {
          const startingSupply = await DappToken.totalSupply()
          const invest = dapptokencrowdsale.buyTokens(investor1.address, { value: oneEther })
          const updatedSupply = await DappToken.totalSupply()
          assert.isTrue(updatedSupply > startingSupply)
        })
      })
      describe("Capped Crowdsale", function () {
        it("has the correct hard cap", async function () {
          const cap = await dapptokencrowdsale.cap()
          Number(cap).should.equal(Number(ethers.utils.parseUnits("100", 18)))
        })
        xit("rejects the transaction when minimum cap isn't met", async function () {
          const value = investorMinCap - 1
          const buyTransaction = await dapptokencrowdsale.buyTokens(investor1.address, {
            value: value,
          })
          // It's getting reverted but throwing an error instead of passing the test
          expect(buyTransaction).to.be.reverted
        })
        xit("allows a new investment below min cap after meeting min cap with previous investment", async function () {
          // First contribution
          const value1 = investorMinCap
          await dapptokencrowdsale.buyTokens(investor1.address, {
            value: value1,
          })
          // Second contribution
          const value2 = 1 // 1 wei
          const buyTransaction = await dapptokencrowdsale.buyTokens(investor1.address, {
            value: value2,
          })
          // Getting reverted saying "TypeError: { ..(22) } is not a thenable"
          buyTransaction.should.be.fulfilled
        })
        xit("doesn't allow investing above the hard cap", async function () {
          const value1 = ethers.utils.parseUnits("2", 18)
          await dapptokencrowdsale.buyTokens(investor1.address, {
            value: value1,
          })
          const value2 = ethers.utils.parseUnits("49", 18)
          const limitExceedingTransaction = await dapptokencrowdsale.buyTokens(investor1.address, {
            value: value2,
          })
          // It's getting reverted but throwing an error instead of passing the test
          expect(limitExceedingTransaction).to.be.reverted
        })
        it("updates the contribution amount after a valid investment", async function () {
          const value = ethers.utils.parseUnits("2", 18)
          await dapptokencrowdsale.buyTokens(investor1.address, {
            value: value,
          })
          const contribution = await dapptokencrowdsale.getUserContribution(investor1.address)
          expect(contribution).to.equal(value)
        })
      })
      describe("Timed Crowdsale", function () {
        it("is open", async function () {
          const isClosed = await dapptokencrowdsale.hasClosed()
          isClosed.should.be.false
        })
      })
      describe("Whitelisted Crowdsale", function () {
        xit("rejects contributions from non-whitelisted investors", async function () {
          const notWhitelisted = investor2.address
          const buyTransaction = await dapptokencrowdsale.buyTokens(notWhitelisted, { value: 1 })
          buyTransaction.should.be.rejected
        })
      })
      describe("Refundable Crowdsale", function () {
        beforeEach(async function () {
          await dapptokencrowdsale.buyTokens(investor1.address, {
            value: ethers.utils.parseUnits("1", 18),
          })
        })
        describe("during crowdsale", function () {
          it("prevents the investor from claiming refund", async function () {
            /* Get the Refund Vault contract */
            // Not working inside the beforeEach statement, don't knpw why
            const RefundVault = await hre.ethers.getContractFactory("RefundVault")
            const vaultAddress = await dapptokencrowdsale.vault()
            const vault = await RefundVault.attach(vaultAddress)
            await vault.connect(investor1)
            await vault.refund(investor1.address)
          })
        })
      })
    })
