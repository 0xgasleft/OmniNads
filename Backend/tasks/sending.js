const {DATA} = require("../scripts/data.js");




// CORE FUNCTIONS

const getOmniNadsInstance = async (ethers, signer, localChain, contractName) => {
  return await ethers.getContractAt(contractName, localChain.deployment, signer);
}

const quoteIt = async (ethers, ctrtInstance, nativeCurrency, remoteChain, tokenID, receiver) => {
  const sendParams = [
    remoteChain.eid,
    ethers.utils.hexZeroPad(
      receiver, 
      32
    ),
    tokenID,
    "0x",
    "0x",
    "0x"
  ];

  const quote = await ctrtInstance.quoteSend(sendParams, false);
  console.log(`Quote result: ${ethers.utils.formatEther(quote.nativeFee)} ${nativeCurrency}`);

  return {sp: sendParams, fee: quote.nativeFee};
}

const sendOmniNad = async (ethers, ctrtInstance, nativeLocalCurrency, localChain, remoteChain, tokenID, signer) => {

    /*console.log(`Approving OmniNad token with id ${tokenID} to be transfered..`);
    const abi = new ethers.utils.AbiCoder();
    const data = abi.encode(["address", "uint"], [localChain.deployment, tokenID]).slice(2);
    const sigHash = ethers.utils.id("approve(address,uint256)").slice(0, 10);
    const approvalReceipt = await signer.sendTransaction({to: localChain.deployment, data: sigHash + data});
    await approvalReceipt.wait();
    */
    console.log("Quoting for send call..");
    const quote = await quoteIt(ethers, ctrtInstance, nativeLocalCurrency, remoteChain, tokenID, signer.address);
  
    const txResp = await ctrtInstance.send(quote.sp, [quote.fee, 0], signer.address, {value: quote.fee});
    await txResp.wait();

    return txResp;
}


// TASKS

task("send-omninad", "Send OmniNad cross-chain")
  .addParam("source", "Chain to send from")
  .addParam("destination", "Chain to send to")
  .addParam("id", "Token ID to send")
  .setAction(async (taskArgs, hre) => {


    const hreChain = hre.config.networks[taskArgs.source];
    const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
    const signer = new hre.ethers.Wallet(hreChain.accounts[0], rpc);

    const localChain = DATA[taskArgs.source];
    const remoteChain = DATA[taskArgs.destination];

    console.log(`Connecting with OmniNads instance at ${localChain.deployment} on ${taskArgs.source}`);
    const oNadInstance = await getOmniNadsInstance(
                                                    hre.ethers, 
                                                    signer, 
                                                    localChain,
                                                    taskArgs.source == "monadtestnet" ? "contracts/MergedOmniNadsMinter.sol:OmniNadsMinter" : "contracts/MergedOmniNadsConsumer.sol:OmniNadsConsumer"
                                                  );
    
    console.log(`Sending from ${taskArgs.source} to ${taskArgs.destination} !`);
    const receipt = await sendOmniNad(hre.ethers, oNadInstance, hreChain.native, localChain, remoteChain, taskArgs.id, signer);
    
    console.log(`Send executed, ${taskArgs.source} hash: ${receipt.hash} !`);
  });
    