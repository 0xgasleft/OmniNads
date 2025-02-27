
const {ethers} = require("hardhat");


const main = async () => {
  const signer = (await ethers.getSigners())[0];
  const gasBalance = await signer.getBalance();
  console.log(`Wallet ${signer.address} has gas balance: ${ethers.utils.formatEther(gasBalance)} ETH/MON`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
