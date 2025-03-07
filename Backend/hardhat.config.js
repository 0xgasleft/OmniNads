require("@nomicfoundation/hardhat-toolbox");
//require("@nomicfoundation/hardhat-verify"); // THE TOOLBOX SHOULD BE DISABLED WHEN USING THIS PLUGIN
require('dotenv').config({ path: __dirname + '/.env' });
require("./tasks/deployment");
require("./tasks/configuration");
require("./tasks/minting");
require("./tasks/sending");
require("./tasks/testing");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  /*sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com"
  },
  etherscan: {
    enabled: false
  },
  etherscan: {
    apiKey: {
      'arbsepolia': process.env.ARB_SEPOLIA_API_KEY,
      "opsepolia": process.env.OP_SEPOLIA_API_KEY
    },
    customChains: [
      {
        network: "arbsepolia",
        chainId: 421614,
        urls: {
            apiURL: "https://api-sepolia.arbiscan.io/api",
            browserURL: "https://sepolia.arbiscan.io/",
        }
      },
      {
        network: "opsepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io/"
        }
      }
    ]
  },*/
  networks: {
    hardhat: {
      forking: {
        url: process.env.ARBITRUM_SEPOLIA_RPC
      }
    },
    arbsepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC,
      accounts: [process.env.SOURCE_PK],
      native: "ETH"
    },
    opsepolia: {
      url: process.env.OPTIMISM_SEPOLIA_RPC,
      accounts: [process.env.SOURCE_PK],
      native: "ETH"
    },
    monadtestnet: {
      url: process.env.MONAD_TESTNET_RPC,
      accounts: [process.env.SOURCE_PK],
      native: "MON"
    }
  }
};
