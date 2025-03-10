const {DATA} = require("../scripts/data.js");

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


const IGNORABLE = ["hardhat"]





task("configure-omninad", "Configure OmniNads")
  .addParam("mint", "Mint chain")
  .setAction(async (taskArgs, hre) => {

    if(!enoughDeployments())
    {
        console.log("Need at least 2 deployments configured in 'data.js'");
        return;
    }
    if(DATA[taskArgs.mint] == undefined)
    {
        console.log("Mint chain not found in 'data.js'");
        return;
    }
    for (const [localChainName, localChain] of Object.entries(DATA))
    {
      if(IGNORABLE.includes(localChainName)) continue;
      
      console.log("--------------------------------------------------------");
      const hreChain = hre.config.networks[localChainName];
      const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
      const signer = new hre.ethers.Wallet(hreChain.accounts[0], rpc);
      const remoteChains = filterChain(localChainName);

      for (const [remoteChainName, remoteChain] of Object.entries(remoteChains)) {

        if(!localChain.evolution_connections.includes(remoteChainName)) continue;

        console.log(`Connecting with omninads instance at ${localChain.deployment} on ${localChainName}`);
        const onadsInstance = await getOmniNadsInstance(
                                                        hre.ethers, 
                                                        signer, 
                                                        localChain, 
                                                        localChainName == taskArgs.mint ? "contracts/merged/MergedOmniNadsMinter.sol:OmniNadsMinter" : "contracts/merged/MergedOmniNadsConsumer.sol:OmniNadsConsumer" 
                                                      );
        
        console.log(`Applying set peers on ${localChainName} with ${remoteChainName}..`);
        await trustRemote(onadsInstance, remoteChain);
        await waitFor(SAFETY_WAIT_PERIOD);

        console.log(`Setting global config for omninads contract on ${localChainName}`);
        await configureItGlobally(onadsInstance, remoteChain);
        await waitFor(SAFETY_WAIT_PERIOD);

        console.log(`Setting send & receive libraries for ${localChainName}`);
        await setLibs(hre.ethers, localChain, remoteChain, signer);
        await waitFor(SAFETY_WAIT_PERIOD);

        console.log(`Setting dvn & executor configs for ${localChainName}`);
        await setConfigs(hre.ethers, localChain, remoteChain, signer);
      }
    }
    
  });


  task("configure-messager", "Configure Messager")
  .setAction(async (taskArgs, hre) => {

    if(!enoughDeployments())
      {
          console.log("Need at least 2 deployments configured in 'data.js'");
          return;
      }

      for (const [localChainName, localChain] of Object.entries(DATA))
        {
          if(IGNORABLE.includes(localChainName)) continue;
          
          console.log("--------------------------------------------------------");
          const hreChain = hre.config.networks[localChainName];
          const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
          const signer = new hre.ethers.Wallet(hreChain.accounts[0], rpc);
          const remoteChains = filterChain(localChainName);
    
          for (const [remoteChainName, remoteChain] of Object.entries(remoteChains)) {
    
            if(!localChain.minting_connections.includes(remoteChainName)) continue;
    
            console.log(`Connecting with messager instance at ${localChain.messager} on ${localChainName}`);
            const messagerInstance = await getMessagerInstance(
                                                            hre.ethers, 
                                                            signer, 
                                                            localChain, 
                                                            "contracts/merged/MergedOmniNadsMessager.sol:OmniNadsMessager"
                                                          );
            
            console.log(`Applying set peers on ${localChainName} with ${remoteChainName}..`);
            await trustRemote(messagerInstance, remoteChain, true);
            await waitFor(SAFETY_WAIT_PERIOD);
    
            console.log(`Setting send & receive libraries for ${localChainName}`);
            await setLibs(hre.ethers, localChain, remoteChain, signer, true);
            await waitFor(SAFETY_WAIT_PERIOD);
    
            console.log(`Setting dvn & executor configs for ${localChainName}`);
            await setConfigs(hre.ethers, localChain, remoteChain, signer, true);
          }
        }


  });
