// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./library/Crowdsale.sol";

contract DappTokenCrowdsale is Crowdsale {
  constructor(
    uint256 _rate,
    address payable _wallet,
    ERC20 _token
  ) Crowdsale(_rate, _wallet, _token) {}

  function algo() public pure returns (uint256) {
    return 2;
  }
}
