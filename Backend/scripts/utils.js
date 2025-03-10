const {Options} = require("@layerzerolabs/lz-v2-utilities");
const fs = require("fs");
const path = require("path");
const { DATA, WHITELIST_ADDRESSES, MAX_SUPPLY, ENDPOINT_ABI } = require("./data.js");



const SAFETY_WAIT_PERIOD = 3;








const saveDeployment = (chain, contractName, address, abi) => {
  const DEPLOYMENTS_FILE = path.join(__dirname, "../deployments.json");

  let deployments = {};
  if (fs.existsSync(DEPLOYMENTS_FILE)) {
    deployments = JSON.parse(fs.readFileSync(DEPLOYMENTS_FILE, "utf-8"));
  }

  if (!deployments[chain]) deployments[chain] = {};
  deployments[chain][contractName] = { address, abi };

  fs.writeFileSync(DEPLOYMENTS_FILE, JSON.stringify(deployments, null, 2));
  console.log(`✅ Deployment record saved for ${contractName} on ${chain}`);
};

const generateStandardJsonInput = async (hre, contractName) => {

  const fs = require("fs");
  const path = require("path");

  const contractPath = path.join(__dirname, `../contracts/${contractName}.sol`);
  if (!fs.existsSync(contractPath)) {
    console.error(`❌ Contract source file not found: ${contractPath}`);
    return;
  }

  const sourceCode = fs.readFileSync(contractPath, "utf8");

  const dependencyPaths = await hre.run("compile:solidity:get-source-paths");
  const dependencySources = {};

  for (const depPath of dependencyPaths) {
    if (fs.existsSync(depPath)) {
      const relativePath = path.relative(process.cwd(), depPath);
      dependencySources[relativePath] = { content: fs.readFileSync(depPath, "utf8") };
    }
  }

  dependencySources[`${contractName}.sol`] = { content: sourceCode };

  const solcConfig = hre.config.solidity;
  const optimizer = solcConfig?.settings?.optimizer || { enabled: true, runs: 200 };
  const evmVersion = solcConfig?.settings?.evmVersion || "paris";

  const standardJson = {
    language: "Solidity",
    sources: dependencySources,
    settings: {
      optimizer: {
        enabled: optimizer.enabled,
        runs: optimizer.runs,
      },
      evmVersion: evmVersion,
      metadata: {
        useLiteralContent: true,
      },
      outputSelection: {
        "*": {
          "*": [
            "metadata", // <--
            "evm.bytecode",
            "evm.bytecode.sourceMap"
          ],
          "": ["ast"],
        },
      },
      libraries: {},
    },
  };

  const STANDARD_JSON_DIR = path.join(__dirname, "../standard-json");
  if (!fs.existsSync(STANDARD_JSON_DIR)) {
    fs.mkdirSync(STANDARD_JSON_DIR, { recursive: true });
  }

  const outputPath = path.join(STANDARD_JSON_DIR, `${contractName}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(standardJson, null, 2));
  console.log(`✅ Standard JSON Input saved: ${outputPath}`);
};

const deploy = async (hre, chain, contractName, name, symbol, additional_params = false) => {
  const chainObj = hre.config.networks[chain];
  const rpc = new hre.ethers.providers.JsonRpcProvider(chainObj.url);
  const signer = chain == "hardhat" ? (await ethers.getSigners())[0] : new hre.ethers.Wallet(chainObj.accounts[0], rpc);

  console.log(`🚀 Deploying ${contractName} on ${chain}...`);

  let params = [name.toUpperCase(), symbol, DATA[chain].endpoint, signer.address];
  if (additional_params) params.push(MAX_SUPPLY, WHITELIST_ADDRESSES, [DATA[chain].allowed]);

  const instance = await hre.ethers.deployContract(contractName, params, signer);
  await instance.deployed();

  console.log(`✅ ${contractName} deployed on ${chain} at: ${instance.address}`);

  //saveDeployment(chain, contractName, instance.address, instance.interface.format("json"));
  //await generateStandardJsonInput(hre, contractName);

  return instance;
};

const deployMessager = async (hre, chain, contractName, additional_params = false) => {
  const chainObj = hre.config.networks[chain];
  const rpc = new hre.ethers.providers.JsonRpcProvider(chainObj.url);
  const signer = chain == "hardhat" ? (await ethers.getSigners())[0] : new hre.ethers.Wallet(chainObj.accounts[0], rpc);

  console.log(`🚀 Deploying OmniNadsMessager on ${chain}...`);

  let params = [DATA[chain].endpoint, signer.address];
  if (additional_params)
  {
    params.push(DATA[chain].deployment);
  } 
  else 
  {
    params.push(ethers.constants.AddressZero);
  }

  const instance = await hre.ethers.deployContract(contractName, params, signer);
  await instance.deployed();

  console.log(`✅ ${contractName} deployed on ${chain} at: ${instance.address}`);

  //await generateStandardJsonInput(hre, contractName);
  return instance;
};

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

const getOmniNadsInstance = async (ethers, signer, localChain, contractName) => {
  return await ethers.getContractAt(contractName, localChain.deployment, signer);
}

const getMessagerInstance = async (ethers, signer, localChain, contractName) => {
  return await ethers.getContractAt(contractName, localChain.messager, signer);
}

const trustRemote = async (ctrtInstance, remoteChain, forMessager=false) => {
    

  const _ = await ctrtInstance.setPeer(remoteChain.eid, 
                                              ethers.utils.zeroPad(
                                                                  forMessager ? remoteChain.messager : remoteChain.deployment, 
                                                                  32
                                            ));
  console.log("Peer set!");
}

const configureItGlobally = async (ctrtInstance, remoteChain) => {
  const enforcedOptions = craftEnforcedOptions(remoteChain.eid);
  console.log(enforcedOptions);
  const txResp = await ctrtInstance.setEnforcedOptions(enforcedOptions);
  await txResp.wait();
  
  console.log("Configuration set!");

}

const setLibs = async (ethers, localChain, remoteChain, signer, forMessager=false) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);
  try {
    const sendTx = await endpointContract.setSendLibrary(
      forMessager ? localChain.messager : localChain.deployment,
      remoteChain.eid,
      localChain.sendLib,
    );
    await sendTx.wait();
    console.log('Send library set successfully.');

    await waitFor(SAFETY_WAIT_PERIOD);

    const receiveTx = await endpointContract.setReceiveLibrary(
      forMessager ? localChain.messager : localChain.deployment,
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

const setSendConfig = async (ethers, localChain, remoteChain, signer, forMessager=false) => {
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
      forMessager ? localChain.messager : localChain.deployment,
      localChain.sendLib,
      [dvnConfigParams, executorConfigParams],
    );
    
    await tx.wait();
    console.log("Send config has been set successfully!");

  } catch (error) {
    console.error('Transaction failed:', error);
  } 
}

const setReceiveConfig = async (ethers, localChain, remoteChain, signer, forMessager=false) => {
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
      forMessager ? localChain.messager : localChain.deployment,
      localChain.receiveLib,
      [dvnConfigParams],
    );
    
    await tx.wait();
    console.log("Receive config has been set successfully!");

  } catch (error) {
    console.error('Transaction failed:', error);
  } 
}

const setConfigs = async (ethers, localChain, remoteChain, signer, forMessager=false) => {
  await setSendConfig(ethers, localChain, remoteChain, signer, forMessager);

  //await waitFor(SAFETY_WAIT_PERIOD);

  await setReceiveConfig(ethers, localChain, remoteChain, signer, forMessager);
}




module.exports = { 
  deploy, 
  deployMessager, 
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
};
