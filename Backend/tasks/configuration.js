const {DATA, ENDPOINT_ABI} = require("../scripts/data.js");
const {Options} = require("@layerzerolabs/lz-v2-utilities");





// HELPERS

const SAFETY_WAIT_PERIOD = 3;

const filterChain = (chain) => {
  const filteredData = { ...DATA };
  delete filteredData[chain];
  return filteredData;
}

const waitFor = async (seconds) => {
  await new Promise(dummy => setTimeout(dummy, seconds * 1000));
}

const enoughDeployments = () => {  
  return Object.keys(DATA).length >= 2;
}

const craftEnforcedOptions = (_eid) => {
  const GAS_LIMIT = 200_000;
  const MSG_VALUE = 0;

  const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE);
  return [[
    _eid,
    1,
    _options.toHex()
  ]];

}




// CORE FUNCTIONS

const getOmniNadsInstance = async (ethers, signer, localChain, contractName) => {
  return await ethers.getContractAt(contractName, localChain.deployment, signer);
}

const trustRemote = async (ctrtInstance, remoteChain) => {
    

  const _ = await ctrtInstance.setPeer(remoteChain.eid, 
                                              ethers.utils.zeroPad(
                                                                  remoteChain.deployment, 
                                                                  32
                                            ));
  console.log("Peer set!");
}

const configureItGlobally = async (ctrtInstance, remoteChain) => {
  const enforcedOptions = craftEnforcedOptions(remoteChain.eid);

  const txResp = await ctrtInstance.setEnforcedOptions(enforcedOptions);
  await txResp.wait();
  
  console.log("Configuration set!");

}

const setLibs = async (ethers, localChain, remoteChain, signer) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);
  try {
    const sendTx = await endpointContract.setSendLibrary(
      localChain.deployment,
      remoteChain.eid,
      localChain.sendLib,
    );
    await sendTx.wait();
    console.log('Send library set successfully.');

    await waitFor(SAFETY_WAIT_PERIOD);

    const receiveTx = await endpointContract.setReceiveLibrary(
      localChain.deployment,
      remoteChain.eid,
      localChain.receiveLib,
      0
    );
    await receiveTx.wait();
    console.log('Receive library set successfully.');

  } catch (error) {
    console.error('Transaction failed:', error);
  }
}

const setSendConfig = async (ethers, localChain, remoteChain, signer) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);

  const dvnConfig = {
    confirmations: 10,
    requiredDVNCount: localChain.dvns.length,
    optionalDVNCount: 0,
    optionalDVNThreshold: 0,
    requiredDVNs: localChain.dvns.sort(),
    optionalDVNs: [],
  };

  const executorConfig = {
    maxMessageSize: 10000,
    executorAddress: localChain.executor,
  };

  const dvnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
  const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([dvnStruct], [dvnConfig]);

  const executorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
  const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
    [executorStruct],
    [executorConfig],
  );

  const dvnConfigParams = {
    eid: remoteChain.eid,
    configType: 2,
    config: encodedUlnConfig,
  };

  const executorConfigParams = {
    eid: remoteChain.eid,
    configType: 1,
    config: encodedExecutorConfig,
  };

  try {
    const tx = await endpointContract.setConfig(
      localChain.deployment,
      localChain.sendLib,
      [dvnConfigParams, executorConfigParams],
    );
    
    await tx.wait();
    console.log("Send config has been set successfully!");

  } catch (error) {
    console.error('Transaction failed:', error);
  } 
}

const setReceiveConfig = async (ethers, localChain, remoteChain, signer) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);

  const dvnConfig = {
    confirmations: 10,
    requiredDVNCount: localChain.dvns.length,
    optionalDVNCount: 0,
    optionalDVNThreshold: 0,
    requiredDVNs: localChain.dvns.sort(),
    optionalDVNs: [],
  };

  const dvnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
  const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([dvnStruct], [dvnConfig]);

  const dvnConfigParams = {
    eid: remoteChain.eid,
    configType: 2,
    config: encodedUlnConfig,
  };

  try {
    const tx = await endpointContract.setConfig(
      localChain.deployment,
      localChain.receiveLib,
      [dvnConfigParams],
    );
    
    await tx.wait();
    console.log("Receive config has been set successfully!");

  } catch (error) {
    console.error('Transaction failed:', error);
  } 
}

const setConfigs = async (ethers, localChain, remoteChain, signer) => {
  await setSendConfig(ethers, localChain, remoteChain, signer);

  await waitFor(SAFETY_WAIT_PERIOD);

  await setReceiveConfig(ethers, localChain, remoteChain, signer);
}




// TASKS

task("configure-omninad", "Configure OmniNads")
  .addOptionalParam("mint", "Mint chain")
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
      
      console.log("--------------------------------------------------------");
      const hreChain = hre.config.networks[localChainName];
      const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
      const signer = new hre.ethers.Wallet(hreChain.accounts[0], rpc);
      const remoteChains = filterChain(localChainName);

      for (const [remoteChainName, remoteChain] of Object.entries(remoteChains)) {

        if(!localChain.connections.includes(remoteChainName)) continue;

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
  .addOptionalParam("mint", "Mint chain")
  .addVariadicPositionalParam("consumers", "Consumer chains")
  .setAction(async (taskArgs, hre) => {
    // TO BE IMPLEMENTED
  });
