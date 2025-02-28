const fs = require("fs");
const path = require("path");
const { DATA, WHITELIST_ADDRESSES, MAX_SUPPLY } = require("./data.js");

const DEPLOYMENTS_FILE = path.join(__dirname, "../deployments.json");
const STANDARD_JSON_DIR = path.join(__dirname, "../standard-json");

// Ensure the directory exists
if (!fs.existsSync(STANDARD_JSON_DIR)) {
  fs.mkdirSync(STANDARD_JSON_DIR, { recursive: true });
}

const saveDeployment = (chain, contractName, address, abi) => {
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
  const solcConfig = hre.config.solidity;
  const optimizer = solcConfig?.settings?.optimizer || { enabled: true, runs: 200 };
  const evmVersion = solcConfig?.settings?.evmVersion || "paris";

  // Construct the Standard JSON Input
  const standardJson = {
    language: "Solidity",
    sources: {
      [`${contractName}.sol`]: {
        content: sourceCode,
      },
    },
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
            "abi",
            "evm.bytecode.object",
            "evm.deployedBytecode.object",
            "evm.methodIdentifiers"
          ],
        },
      },
    },
  };

  // Save JSON file
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
  const signer = new hre.ethers.Wallet(chainObj.accounts[0], rpc);

  console.log(`🚀 Deploying ${contractName} on ${chain}...`);

  let params = [name.toUpperCase(), symbol, DATA[chain].endpoint, signer.address];
  if (additional_params) params.push(MAX_SUPPLY, WHITELIST_ADDRESSES);

  const instance = await hre.ethers.deployContract(contractName, params, signer);
  await instance.deployed();

  console.log(`✅ ${contractName} deployed on ${chain} at: ${instance.address}`);

  saveDeployment(chain, contractName, instance.address, instance.interface.format("json"));

  // Generate Standard JSON Input for verification
  await generateStandardJsonInput(hre, contractName);
};

module.exports = { deploy };
