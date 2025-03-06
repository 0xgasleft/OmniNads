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
    mapping(address => bool) private _isAllowedSmartContract;

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        uint16 _maxSupply,
        address[] memory _whitelistedAddresses,
        address[] memory _allowedSmartContracts
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

        for (uint i = 0; i < _allowedSmartContracts.length; ) {
            _isAllowedSmartContract[_allowedSmartContracts[i]] = true;
            unchecked {
                i++;
            }
        }

    }

    modifier isNotSmartContract() {
        require(
            msg.sender.code.length == 0,
            "Smart contract mint is not allowed!"
        );
        _;
    }

    modifier onlyAllowedSmartContract() {
        require(
            _isAllowedSmartContract[msg.sender],
            "Not allowed smart contract!"
        );
        _;
    }

    function nextPhase() external override onlyOwner {
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

    function emergencyDisableMint() external override onlyOwner {
        mintInfo._phase = DynamicONFT.MintPhase.DISABLED;
    }

    function addToWhitelist(address _address) external override onlyOwner {
        _isWhitelisted[_address] = true;
        emit DynamicONFT.WhitelistUpdated(_address, true);
    }

    function removeFromWhitelist(address _address) external override onlyOwner {
        _isWhitelisted[_address] = false;
        emit DynamicONFT.WhitelistUpdated(_address, false);
    }

    function addToAllowedSmartContracts(address _address) external override onlyOwner {
        _isAllowedSmartContract[_address] = true;
        emit DynamicONFT.AllowedSmartContractUpdated(_address, true);
    }

    function removeFromAllowedSmartContracts(address _address) external override onlyOwner {
        _isAllowedSmartContract[_address] = false;
        emit DynamicONFT.AllowedSmartContractUpdated(_address, false);
    }

    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(buffer);
    }

    function _tokenStateToString(DynamicONFT.TokenState _state) internal pure returns (string memory) {
        if (_state == DynamicONFT.TokenState.NIL) return "0";
        if (_state == DynamicONFT.TokenState.MINTED) return "1";
        if (_state == DynamicONFT.TokenState.EVOLVED) return "2";
        if (_state == DynamicONFT.TokenState.ULTIMATE) return "3";
        return "unknown";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory tokenIdStr = _uintToString(tokenId);
        string memory tokenStateStr = _tokenStateToString(tokenState[tokenId]);

        return string(abi.encodePacked(_baseURI(), tokenStateStr, "/omni-nad-", tokenIdStr, ".json"));
    }

    function _mint(address _minter) internal {
        require(
            mintInfo._maxSupply >= mintInfo._totalSupply,
            "Max supply reached!"
        );
        require(!_hasMinted[_minter], "User already minted!");

        unchecked {
            ++mintInfo._totalSupply;
        }

        _hasMinted[_minter] = true;
        tokenState[mintInfo._totalSupply] = DynamicONFT.TokenState.MINTED;
        
        _mint(_minter, mintInfo._totalSupply);
    }

    function crossChainMint(address _remoteMinter) external override onlyAllowedSmartContract {
        if(mintInfo._phase == DynamicONFT.MintPhase.PUBLIC)
        {
            _mint(_remoteMinter);
        }
        else if(mintInfo._phase == DynamicONFT.MintPhase.WHITELIST)
        {
            require(_isWhitelisted[_remoteMinter], "User is not whitelisted!");
            _mint(_remoteMinter);
        }
        else
        {
            revert("Minting is disabled!");
        }
        emit DynamicONFT.PublicMint(mintInfo._totalSupply, msg.sender);
    }

    function publicMint() external override isNotSmartContract {
        require(
            mintInfo._phase == DynamicONFT.MintPhase.PUBLIC,
            "Not in public phase!"
        );
        _mint(msg.sender);
        emit DynamicONFT.PublicMint(mintInfo._totalSupply, msg.sender);
    }

    function whitelistMint() external override isNotSmartContract {
        require(_isWhitelisted[msg.sender], "User is not whitelisted!");
        require(
            mintInfo._phase == DynamicONFT.MintPhase.WHITELIST,
            "Not in whitelist phase!"
        );
        _mint(msg.sender);
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