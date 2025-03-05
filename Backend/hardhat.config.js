require("@nomicfoundation/hardhat-toolbox");
//require("@nomicfoundation/hardhat-verify"); // THE TOOLBOX SHOULD BE DISABLED WHEN USING THIS PLUGIN
require('dotenv').config({ path: __dirname + '/.env' });
require("./tasks/deployment");
require("./tasks/configuration");
require("./tasks/minting");
require("./tasks/sending");

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
      'sepolia': process.env.SEPOLIA_API_KEY,
      "opsepolia": process.env.OP_SEPOLIA_API_KEY
    },
    customChains: [
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
    sepolia: {
      url: process.env.SEPOLIA_RPC,
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
