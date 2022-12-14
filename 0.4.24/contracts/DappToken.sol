// SPDX-License-Identifier: MIT
pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

contract DappToken is DetailedERC20, MintableToken, PausableToken {
  constructor(
    string _name,
    string _symbol,
    uint8 _decimals
  ) public DetailedERC20(_name, _symbol, _decimals) {}
}
