// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OApp, Origin, MessagingFee } from "./lz/oapp/OApp.sol";
import { OAppOptionsType3 } from "./lz/oapp/libs/OAppOptionsType3.sol";
import { IOmniNadsMinter } from "./interfaces/IOmniNadsMinter.sol";
import { IOmniNadsMessager } from "./interfaces/IOmniNadsMessager.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";




contract OmniNadsMessager is IOmniNadsMessager, OApp, OAppOptionsType3 {

    uint public constant MONAD_CHAIN_ID = 10143;
    uint32 public constant MONAD_LZ_EID = 40204;
    address public omniNadsMinter;


    constructor(address _endpoint, address _owner, address _omniNadsMinter) 
    OApp(_endpoint, _owner)
    Ownable(_owner) 
    {
        omniNadsMinter = _omniNadsMinter;
    }

    function setOmniNadsMinter(address _omniNadsMinter) external onlyOwner 
    {
        omniNadsMinter = _omniNadsMinter;
    }

    function quoteRequest(bytes memory _options) public view returns (uint256) 
    {
        return _quote(MONAD_LZ_EID, hex"", _options, false).nativeFee;
    }

    function getChainId() public view returns (uint _chainId) {
        assembly {
            _chainId := chainid()
        }
    }

    function requestCrossChainMint(bytes memory _options) external payable {
        uint _fee = quoteRequest(_options);
        require(msg.value >= _fee, "OmniNadsMessager: Insufficient fee");

        _lzSend(
            MONAD_LZ_EID,
            hex"",
            _options,
            MessagingFee(_fee, 0),
            payable(msg.sender)
        );
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32,
        bytes calldata,
        address,
        bytes calldata
    ) internal override 
    {
        require(getChainId() == MONAD_CHAIN_ID, "OmniNadsMessager: Receiving only allowed on Monad chain");
        require(omniNadsMinter != address(0), "OmniNadsMinter address not set!");

        IOmniNadsMinter(omniNadsMinter).crossChainMint(address(uint160(uint(_origin.sender))));
    }

    function withdrawNative(address _to) external onlyOwner {
        (bool success, ) = _to.call{value: address(this).balance}("");
        require(success, "OmniNadsMessager: Withdraw failed");
    }

    receive() external payable {}


}