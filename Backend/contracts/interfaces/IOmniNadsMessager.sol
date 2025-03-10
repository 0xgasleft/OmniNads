// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

interface IOmniNadsMessager {
    function requestCrossChainMint(bytes memory _options) external payable;
    function setOmniNadsMinter(address _omniNadsMinter) external;
}
