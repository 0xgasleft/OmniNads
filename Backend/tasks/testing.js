const {DATA} = require("../scripts/data.js");
const { deploy, deployMessager,  } = require("../scripts/utils.js");
const {Options} = require("@layerzerolabs/lz-v2-utilities");
const { 
  getOmniNadsInstance,
  getMessagerInstance,
  trustRemote, 
  configureItGlobally, 
  setLibs, 
  setConfigs, 
  filterChain, 
  enoughDeployments,
  waitFor,
  SAFETY_WAIT_PERIOD
} = require("../scripts/utils.js");



task("test-omninad", "Test OmniNads contracts")
  .setAction(async (taskArgs, hre) => {

    const minter = await deploy(hre, "hardhat", "OmniNadsMinter", "OmniNads", "ONAD", true);
    const consumer = await deploy(hre, "hardhat", "OmniNadsConsumer", "OmniNads", "ONAD");

    const abi = new ethers.utils.AbiCoder();
    const signer = (await ethers.getSigners())[0];

    console.log(`Setting base token URI in minter..`)
    const setBaseTokenUriSigHash = ethers.utils.id("setBaseURI(string)").slice(0, 10);
    const setTokenParams = abi.encode(["string"], ["https://arweave.net/xA4zVEvQWa1xGlFnAFgeQjqAgSzYaJok6QMjiF0KxD4/sepolia/"]).slice(2);
    const setBTUReceipt = await signer.sendTransaction({to: minter.address, data: setBaseTokenUriSigHash + setTokenParams});
    await setBTUReceipt.wait();
    console.log("Base token URI set!");

    console.log(`Setting base token URI in consumer..`)
    const setBaseTokenUriSigHash2 = ethers.utils.id("setBaseURI(string)").slice(0, 10);
    const setTokenParams2 = abi.encode(["string"], ["https://arweave.net/xA4zVEvQWa1xGlFnAFgeQjqAgSzYaJok6QMjiF0KxD4/sepolia/"]).slice(2);
    const setBTUReceipt2 = await signer.sendTransaction({to: consumer.address, data: setBaseTokenUriSigHash2 + setTokenParams2});
    await setBTUReceipt2.wait();
    console.log("Base token URI set!");

    console.log("Enabling whitelist phase..");
    const phase1SigHash = ethers.utils.id("nextPhase()").slice(0, 10);
    const phase1Receipt = await signer.sendTransaction({to: minter.address, data: phase1SigHash});
    await phase1Receipt.wait();

    console.log("Enabling public phase..");
    const phase2SigHash = ethers.utils.id("nextPhase()").slice(0, 10);
    const phase2Receipt = await signer.sendTransaction({to: minter.address, data: phase2SigHash});
    await phase2Receipt.wait();
    
    console.log(`Minting OmniNad token..`);
    const mintSigHash = ethers.utils.id("publicMint()").slice(0, 10);
    const mintReceipt = await signer.sendTransaction({to: minter.address, data: mintSigHash});
    await mintReceipt.wait();

    console.log(`Watching minted token URI..`)
    const tokenURI = await minter.tokenURI(1);
    console.log(`Minted token URI: ${tokenURI}`);

    console.log("Finished!");
    
  });

  task("test-crosschain-mint", "Test cross-chain mint on OmniNads")
  .addParam("requester", "Requester chain")
  .setAction(async (taskArgs, hre) => {
    
    const hreChain = hre.config.networks[taskArgs.requester];
    const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
    const signer = taskArgs.requester == "hardhat" ? (await ethers.getSigners())[0] : new hre.ethers.Wallet(hreChain.accounts[0], rpc);
    const remoteChain = DATA["monadtestnet"];

    const messagerInstance = taskArgs.requester == "hardhat" ? 
                              await deployMessager(
                                hre, 
                                taskArgs.requester, 
                                "contracts/merged/MergedOmniNadsMessager.sol:OmniNadsMessager"
                              )
                              : await getMessagerInstance(
                                hre.ethers, 
                                signer, 
                                DATA[taskArgs.requester], 
                                "contracts/merged/MergedOmniNadsMessager.sol:OmniNadsMessager"
                              );
    
    if(taskArgs.requester == "hardhat")
    {
      console.log(`Applying set peers on ${taskArgs.requester} with monadtestnet..`);
      await trustRemote(messagerInstance, remoteChain, true);
      let localchainObj = DATA[taskArgs.requester];
      localchainObj.messager = messagerInstance.address;

      console.log(`Setting send & receive libraries for ${taskArgs.requester}`);
      await setLibs(hre.ethers, localchainObj, remoteChain, signer, true);


      console.log(`Setting dvn & executor configs for ${taskArgs.requester}`);
      await setConfigs(hre.ethers, localchainObj, remoteChain, signer, true);
    }
    
    console.log("Quote:");
    const options = Options.newOptions().addExecutorLzReceiveOption(200_000, 0).toHex();
    console.log(`Quoting: ${ethers.utils.formatEther(await messagerInstance.quoteRequest(options))} ETH`);
    const crossMintReceipt = await messagerInstance.requestCrossChainMint(options, {value: await messagerInstance.quoteRequest(options)});
    console.log(`Cross-chain mint request sent at: ${crossMintReceipt.hash}`);


  });