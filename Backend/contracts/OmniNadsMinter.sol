// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import "./lz/onft/ONFT721.sol";
import "./interfaces/IOmniNadsMinter.sol";
import "./libs/DynamicONFT.sol";


contract OmniNadsMinter is IOmniNadsMinter, ONFT721 {


    DynamicONFT.MintInfo public mintInfo;
    mapping(uint => DynamicONFT.TokenState) public tokenState;
    mapping(address => bool) private _hasMinted;
    mapping(address => bool) private _isWhitelisted;
    



    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        uint16 _maxSupply,
        address[] memory _whitelistedAddresses
    ) ONFT721(_name, _symbol, _lzEndpoint, _delegate) {

        mintInfo._phase = DynamicONFT.MintPhase.DISABLED;
        mintInfo._maxSupply = _maxSupply;
        mintInfo._totalSupply = 0;

        for (uint i = 0; i < _whitelistedAddresses.length; ) {
            _isWhitelisted[_whitelistedAddresses[i]] = true;
            unchecked {
                i++;
            }
        }

        emit DynamicONFT.WhitelistUpdated();
    }

    modifier isNotSmartContract() {
        require(
            msg.sender.code.length == 0,
            "Smart contract mint is not allowed!"
        );
        _;
    }

    function nextPhase() external onlyOwner {
        require(
            mintInfo._phase != DynamicONFT.MintPhase.PUBLIC,
            "Already in last phase!"
        );
        mintInfo._phase = DynamicONFT.MintPhase(uint8(mintInfo._phase) + 1);

        if (mintInfo._phase == DynamicONFT.MintPhase.WHITELIST) {
            emit DynamicONFT.WhitelistPhaseStarted();
        } else {
            emit DynamicONFT.PublicPhaseStarted();
        }
    }

    function emergencyDisableMint() external onlyOwner {
        mintInfo._phase = DynamicONFT.MintPhase.DISABLED;
    }

    function addToWhitelist(address _address) external override onlyOwner {
        _isWhitelisted[_address] = true;
        emit DynamicONFT.WhitelistUpdated();
    }

    function removeFromWhitelist(address _address) external override onlyOwner {
        _isWhitelisted[_address] = false;
        emit DynamicONFT.WhitelistUpdated();
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        return
            string(
                abi.encodePacked(baseTokenURI, tokenState[tokenId],"/omni-nad-", tokenId, ".json")
            );
    }

    function _mint() internal {
        require(
            mintInfo._maxSupply >= mintInfo._totalSupply,
            "Max supply reached!"
        );
        require(!_hasMinted[msg.sender], "User already minted!");

        unchecked {
            ++mintInfo._totalSupply;
        }

        _hasMinted[msg.sender] = true;
        tokenState[mintInfo._totalSupply] = DynamicONFT.TokenState.MINTED;
        
        _mint(msg.sender, mintInfo._totalSupply);
    }

    function publicMint() external isNotSmartContract {
        require(
            mintInfo._phase == DynamicONFT.MintPhase.PUBLIC,
            "Not in whitelist phase!"
        );
        _mint();
        emit DynamicONFT.PublicMint(mintInfo._totalSupply, msg.sender);
    }

    function whitelistMint() external isNotSmartContract {
        require(_isWhitelisted[msg.sender], "User is not whitelisted!");
        require(
            mintInfo._phase == DynamicONFT.MintPhase.WHITELIST,
            "Not in whitelist phase!"
        );
        _mint();
        emit DynamicONFT.WhitelistMint(mintInfo._totalSupply, msg.sender);
    }

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