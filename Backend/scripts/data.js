
const WHITELIST_ADDRESSES = [

]

const MAX_SUPPLY = 0;

const DATA = {
    "sepolia": {
      "connections": ["monadtestnet", "opsepolia"],
      "endpoint": "0x6EDCE65403992e310A62460808c4b910D972f10f",
      "eid": 40161,
      "deployment": "",
      "sendLib": "0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE",
      "receiveLib": "0xdAf00F5eE2158dD58E0d3857851c432E34A3A851",
      "dvns": ["0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193"],
      "executor": "0x718B92b5CB0a5552039B593faF724D182A881eDA"
    },
    "opsepolia": {
      "connections": ["monadtestnet", "sepolia"],
      "endpoint": "0x6EDCE65403992e310A62460808c4b910D972f10f",
      "eid": 40232,
      "deployment": "",
      "sendLib": "0xB31D2cb502E25B30C651842C7C3293c51Fe6d16f",
      "receiveLib": "0x9284fd59B95b9143AF0b9795CAC16eb3C723C9Ca",
      "dvns": ["0xd680ec569f269aa7015f7979b4f1239b5aa4582c"],
      "executor": "0xDc0D68899405673b932F0DB7f8A49191491A5bcB"
    },
    "monadtestnet": {
      "connections": ["sepolia", "opsepolia"],
      "endpoint": "0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff",
      "eid": 40204,
      "deployment": "",
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

