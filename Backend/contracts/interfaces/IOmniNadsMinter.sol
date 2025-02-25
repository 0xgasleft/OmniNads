// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

interface IOmniNadsMinter {
    function whitelistMint() external;
    function publicMint() external;
    function emergencyDisableMint() external;
    function nextPhase() external;
    function addToWhitelist(address _address) external;
    function removeFromWhitelist(address _address) external;
}