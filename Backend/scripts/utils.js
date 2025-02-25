
const {DATA, WHITELIST_ADDRESSES, MAX_SUPPLY} = require("./data.js");



const deploy = async (chain, contractName, name, symbol, additional_params=false) => {
  const chainObj = hre.config.networks[chain];
  const rpc = new hre.ethers.providers.JsonRpcProvider(chainObj);
  const signer = new hre.ethers.Wallet(chainObj.accounts[0], rpc);
  
  console.log(`Deploying ${contractName} on ${chain}`);

  let params = [
    name.toUpperCase(),
    symbol,
    DATA[chain].endpoint,
    signer.address
  ];

  if(additional_params) params.push(MAX_SUPPLY, WHITELIST_ADDRESSES);

  const instance = await hre.ethers.deployContract(
                                              contractName, 
                                              params,
                                              signer
                                          );

  await instance.deployed();
  console.log(`${contractName} contract deployed on ${chain} at: ${instance.address}`);
}

module.exports = {
  deploy
}