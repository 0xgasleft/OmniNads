const fs = require("fs");
const path = require("path");
const { DATA, WHITELIST_ADDRESSES, MAX_SUPPLY } = require("./data.js");

const DEPLOYMENTS_FILE = path.join(__dirname, "../deployments.json");
const STANDARD_JSON_DIR = path.join(__dirname, "../standard-json");

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

  const dependencyPaths = await hre.run("compile:solidity:get-source-paths");
  const dependencySources = {};

  for (const depPath of dependencyPaths) {
    if (fs.existsSync(depPath)) {
      const relativePath = path.relative(process.cwd(), depPath);
      dependencySources[relativePath] = { content: fs.readFileSync(depPath, "utf8") };
    }
  }

  /*const layerZeroPath = path.join(process.cwd(), "node_modules/@layerzerolabs");
  if (fs.existsSync(layerZeroPath)) {
    const readLayerZeroFiles = (dir) => {
      fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
        const fullPath = path.join(dir, file.name);
        const relativePath = `@layerzerolabs/${path.relative(layerZeroPath, fullPath)}`;

        if (file.isDirectory()) {
          readLayerZeroFiles(fullPath); 
        } else if (file.name.endsWith(".sol")) {
          dependencySources[relativePath] = { content: fs.readFileSync(fullPath, "utf8") };
        }
      });
    };
    readLayerZeroFiles(layerZeroPath);
  }*/

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
  const signer = new hre.ethers.Wallet(chainObj.accounts[0], rpc);

  console.log(`🚀 Deploying ${contractName} on ${chain}...`);

  let params = [name.toUpperCase(), symbol, DATA[chain].endpoint, signer.address];
  if (additional_params) params.push(MAX_SUPPLY, WHITELIST_ADDRESSES);

  const instance = await hre.ethers.deployContract(contractName, params, signer);
  await instance.deployed();

  console.log(`✅ ${contractName} deployed on ${chain} at: ${instance.address}`);

  saveDeployment(chain, contractName, instance.address, instance.interface.format("json"));

  await generateStandardJsonInput(hre, contractName);
};

module.exports = { deploy };
