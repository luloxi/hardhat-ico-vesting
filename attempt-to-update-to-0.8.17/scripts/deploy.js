async function main() {
  const DappToken = await hre.ethers.getContractFactory("DappToken")
  const dapptoken = await DappToken.deploy("DappToken", "DT")

  await dapptoken.deployed()

  console.log(`DappToken deployed to ${dapptoken.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
