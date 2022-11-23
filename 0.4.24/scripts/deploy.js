async function main() {
  const _name = "DappToken"
  const _symbol = "DT"
  const _decimals = "18"

  const DappToken = await hre.ethers.getContractFactory("DappToken")
  const dapptoken = await DappToken.deploy(_name, _symbol, _decimals)

  await dapptoken.deployed()

  console.log(`DappToken deployed to ${dapptoken.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
