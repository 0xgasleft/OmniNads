const {DATA} = require("../scripts/data.js");

task("mint-omninad", "Mint an OmniNad")
  .addParam("chain", "Chain to mint on")
  .setAction(async (taskArgs, hre) => {

    const hreChain = hre.config.networks[taskArgs.chain];
    const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
    const signer = new hre.ethers.Wallet(hreChain.accounts[0], rpc);

    const localChain = DATA[taskArgs.chain];

    console.log("Enabling whitelist phase..");
    const phase1SigHash = ethers.utils.id("nextPhase()").slice(0, 10);
    const phase1Receipt = await signer.sendTransaction({to: localChain.deployment, data: phase1SigHash});
    await phase1Receipt.wait();

    console.log("Enabling public phase..");
    const phase2SigHash = ethers.utils.id("nextPhase()").slice(0, 10);
    const phase2Receipt = await signer.sendTransaction({to: localChain.deployment, data: phase2SigHash});
    await phase2Receipt.wait();
    
    console.log(`Minting OmniNad token..`);
    const mintSigHash = ethers.utils.id("publicMint()").slice(0, 10);
    const mintReceipt = await signer.sendTransaction({to: localChain.deployment, data: mintSigHash});
    await mintReceipt.wait();

    console.log("Minting successful!");

  });