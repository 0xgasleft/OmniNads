// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import "@layerzerolabs/onft-evm/contracts/onft721/ONFT721.sol";
import { SendParam, MessagingFee, MessagingReceipt } from "@layerzerolabs/onft-evm/contracts/onft721/interfaces/IONFT721.sol";
import "./libs/DynamicONFT.sol";



contract OmniNadsConsumer is ONFT721 {


    mapping(uint => DynamicONFT.TokenState) public tokenState;


    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) ONFT721(_name, _symbol, _lzEndpoint, _delegate) { }

    

    function send(
        SendParam memory _sendParam,
        MessagingFee calldata _fee,
        address _refundAddress
    ) external payable override returns (MessagingReceipt memory msgReceipt) {
        
        _debit(msg.sender, _sendParam.tokenId, _sendParam.dstEid);

        _sendParam.tokenId = DynamicONFT.encodeTokenInfo(
            _sendParam.tokenId,
            tokenState[_sendParam.tokenId]
        );
        delete tokenState[_sendParam.tokenId];

        (bytes memory message, bytes memory options) = _buildMsgAndOptions(
            _sendParam
        );

        msgReceipt = _lzSend(
            _sendParam.dstEid,
            message,
            options,
            _fee,
            _refundAddress
        );

        emit ONFTSent(
            msgReceipt.guid,
            _sendParam.dstEid,
            msg.sender,
            _sendParam.tokenId
        );
    }

    function _credit(
        address _to,
        uint256 _encodedTokenInfo,
        uint32 /*_srcEid*/
    ) internal override {
        
        (uint256 _tokenId, DynamicONFT.TokenState _receivedState) = DynamicONFT.decodeTokenInfo(
            _encodedTokenInfo
        );
        uint8 _evolvedState = uint8(_receivedState);

        if(_evolvedState < 3)
        {
            _evolvedState += 1;
            emit DynamicONFT.TokenEvolved(_tokenId, _evolvedState);
        }

        tokenState[_tokenId] = DynamicONFT.TokenState(_evolvedState);

        _mint(_to, _tokenId);
    }

}