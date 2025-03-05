// SPDX-License-Identifier: MIT

import { SendParam, MessagingFee, MessagingReceipt } from "../lz/onft/interfaces/IONFT721.sol";

pragma solidity ^0.8.22;

interface IOmniNadsMinter {
    function crossChainMint(address _remoteMinter) external;
    function publicMint() external;
    function whitelistMint() external;
    function emergencyDisableMint() external;
    function nextPhase() external;
    function addToWhitelist(address _address) external;
    function removeFromWhitelist(address _address) external;
    function addToAllowedSmartContracts(address _address) external;
    function removeFromAllowedSmartContracts(address _address) external;
}
