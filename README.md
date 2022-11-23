# ERC20 ICO with Vesting schedule

Hardhat version of [this playlist by Dapp University](https://www.youtube.com/playlist?list=PLS5SEs8ZftgULF-lbxy-is9x_7mTMHFIN)

- Crowdsale (send eth to smart contract and compute ammount of tokens based on a rate)
- Timed Crowdsale (opening time and closing time)
- Capped Crowdsale (maximum amount of funds it can raise on a crowd sale)
- Minted Crowdsale (every time a token is purchased, it is minted, instead of having a set total supply)
- Whitelist Crowdsale (if you're on a previously crafted list of addresses, you can buy)
- Refundable Crowdsale (minimum funding goal, if not met, all of the funds sold in the public round are going to be refunded from a refund vault)

- Presale/Public Sale (ICO has two stages, presale has a different redemption rate, more tokens per eth)
- Token Distribution & Vesting (distribution of initial tokens)

## How to use

Move into selected version folder (currently only 0.24.4 is being developed, update is a work in progress)

Install repository using `yarn`

Run tests with `yarn hardhat test`

### Test with console

1. Open a terminal and run `yarn hardhat node`
2. On another terminal, run `yarn hardhat run scripts/deploy.js --network localhost`
3. Then run `yarn hardhat console --network localhost`
4. Connect to DappToken to be able to send commands (replace address with your address)

```
const Token = await ethers.getContractFactory("DappToken")
const token = await Token.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
```

5. Check if it's connected with `await token.name()`. It should return the token's name.

- **.toString()** helps you to display uint256 numbers (which are too big for JS).

For more information on using the console, refer to [Hardhat documentation](https://docs.openzeppelin.com/learn/deploying-and-interacting?pref=hardhat)
