// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;


library DynamicONFT {

    enum TokenState {
        NIL,
        MINTED,
        EVOLVED,
        ULTIMATE
    }

    enum MintPhase {
        DISABLED,
        WHITELIST,
        PUBLIC
    }

    struct MintInfo {
        uint16 _maxSupply;
        uint16 _totalSupply;
        MintPhase _phase;
    }

    event WhitelistUpdated();
    event WhitelistPhaseStarted();
    event PublicPhaseStarted();
    event WhitelistMint(uint indexed tokenId, address indexed minter);
    event PublicMint(uint indexed tokenId, address indexed minter);
    event TokenEvolved(uint indexed tokenId, uint8 indexed evolution);


    function decodeTokenInfo(uint256 _encodedTokenInfo) pure internal returns (uint256 _tokenId, TokenState _state)
    {
        uint8 _cachedState = uint8(_encodedTokenInfo % 10);
        if(_cachedState > 3)
        {
            revert("Invalid token state");
        }
        _state = TokenState(_cachedState);
        _tokenId = uint64(_encodedTokenInfo / 10);
    }

    function encodeTokenInfo(uint256 _tokenId, TokenState _state) pure internal returns (uint _encodedTokenInfo) 
    {
        uint8 _cachedState = uint8(_state);
        if(_cachedState > 3)
        {
            revert("Invalid token state");
        }
        _encodedTokenInfo = _tokenId * 10 + _cachedState;
    }


}