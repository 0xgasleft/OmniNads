
const WHITELIST_ADDRESSES = [
  "0x7B61605BfE32c36D5df2aEc37707b3fA2f12b8B0",
  "0x4f5a65e0426264f39019bF608f3D68A6AaE8b4c3",
]

const MAX_SUPPLY = 1111;

const DATA = {
    "hardhat": { // FORK of ARB SEPOLIA for TESTING PURPOSE ONLY
      "connections": ["opsepolia", "monadtestnet"],
      "endpoint": "0x6EDCE65403992e310A62460808c4b910D972f10f",
      "eid": 40231,
      "deployment": "",
      "sendLib": "0x4f7cd4DA19ABB31b0eC98b9066B9e857B1bf9C0E",
      "receiveLib": "0x75Db67CDab2824970131D5aa9CECfC9F69c69636",
      "dvns": ["0x53f488e93b4f1b60e8e83aa374dbe1780a1ee8a8"],
      "executor": "0x5Df3a1cEbBD9c8BA7F8dF51Fd632A9aef8308897"
    },
    "arbsepolia": {
      "connections": ["opsepolia", "monadtestnet"],
      "endpoint": "0x6EDCE65403992e310A62460808c4b910D972f10f",
      "eid": 40231,
      "deployment": "0x6F04fd7981CF2D1f323BFAd46136FDC664fEAd81",
      "sendLib": "0x4f7cd4DA19ABB31b0eC98b9066B9e857B1bf9C0E",
      "receiveLib": "0x75Db67CDab2824970131D5aa9CECfC9F69c69636",
      "dvns": ["0x53f488e93b4f1b60e8e83aa374dbe1780a1ee8a8"],
      "executor": "0x5Df3a1cEbBD9c8BA7F8dF51Fd632A9aef8308897"
    },
    "opsepolia": {
      "connections": ["monadtestnet", "sepolia"],
      "endpoint": "0x6EDCE65403992e310A62460808c4b910D972f10f",
      "eid": 40232,
      "deployment": "0xd2D87D2b98c899BB5B98CDFbeca24ca678aFd054",
      "sendLib": "0xB31D2cb502E25B30C651842C7C3293c51Fe6d16f",
      "receiveLib": "0x9284fd59B95b9143AF0b9795CAC16eb3C723C9Ca",
      "dvns": ["0xd680ec569f269aa7015f7979b4f1239b5aa4582c"],
      "executor": "0xDc0D68899405673b932F0DB7f8A49191491A5bcB"
    },
    "monadtestnet": {
      "connections": ["opsepolia"],
      "endpoint": "0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff",
      "eid": 40204,
      "deployment": "0x67f36eE7A4b4fbBB8e18215B8Fa3223C867468C1",
      "sendLib": "0xd682ECF100f6F4284138AA925348633B0611Ae21",
      "receiveLib": "0xcF1B0F4106B0324F96fEfcC31bA9498caa80701C",
      "dvns": ["0x88b27057a9e00c5f05dda29241027aff63f9e6e0"],
      "executor": "0x9dB9Ca3305B48F196D18082e91cB64663b13d014"
    }
  }



const ENDPOINT_ABI = [
  'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
  'function setSendLibrary(address oapp, uint32 eid, address sendLib) external',
  'function setReceiveLibrary(address oapp, uint32 eid, address receiveLib, uint256 _gracePeriod) external',
];
  
module.exports = {
  DATA,
  WHITELIST_ADDRESSES,
  MAX_SUPPLY,
  ENDPOINT_ABI
}

