// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import "@layerzerolabs/onft-evm/contracts/onft721/ONFT721.sol";



contract OmniNadsConsumer is ONFT721 {

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) ONFT721(_name, _symbol, _lzEndpoint, _delegate) { }

    

    // TO BE IMPLEMENTED
}