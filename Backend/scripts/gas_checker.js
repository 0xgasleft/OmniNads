const hre = require("hardhat");

const IGNORABLE = ['hardhat', 'localhost'];

const main = async () => {

  console.log("---------------------------- Gas Checker ----------------------------");
  const networks = hre.config.networks;
  const networkNames = Object.keys(networks).filter((networkName) => !IGNORABLE.includes(networkName));
  console.log(`${networkNames.length} chains supported: ${networkNames.join(', ')}`);
  console.log(`---------------------------------------------------------------------`);

  for (const networkName in networks) {

    if (IGNORABLE.includes(networkName)) continue;

    console.log(`Checking gas balance for ${networkName}`);
    const chainObj = networks[networkName];
    const rpc = new hre.ethers.providers.JsonRpcProvider(chainObj.url);
    const signer = new hre.ethers.Wallet(chainObj.accounts[0], rpc);
    const gasBalance = await signer.getBalance();

    console.log(`Wallet ${signer.address} has gas balance: ${ethers.utils.formatEther(gasBalance)} ${chainObj.native}`);
    console.log(`---------------------------------------------------------------------`);
  }
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
