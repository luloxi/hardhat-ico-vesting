// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";

contract DappTokenCrowdsale is
  Crowdsale,
  MintedCrowdsale,
  CappedCrowdsale,
  TimedCrowdsale,
  WhitelistedCrowdsale,
  RefundableCrowdsale
{
  //  Minimum investor contribution - 0.002 ETH
  uint256 public investorMinCap = 2000000000000000;
  // Maximum investor contribution - 50 ETH
  uint256 public investorHardCap = 50000000000000000000;
  mapping(address => uint256) public contributions;

  constructor(
    uint256 _rate,
    address _wallet,
    ERC20 _token,
    uint256 _cap,
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _goal
  )
    public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_openingTime, _closingTime)
    RefundableCrowdsale(_goal)
  {
    require(_goal <= _cap);
  }

  /**
   * @dev Returns the amount contributed so far by a specific user
   * @param _beneficiary Address of contributor
   * @return User contribution so far
   */

  function getUserContribution(address _beneficiary) public view returns (uint256) {
    return contributions[_beneficiary];
  }

  /**
   * @dev Extend parent behavior requiring purchase to respect investor min/max funding cap
   * @param _beneficiary Token purchaser
   * @param _weiAmount Amount of wei contributed
   */

  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    uint256 _existingContribution = contributions[_beneficiary];
    uint256 _newContribution = _existingContribution.add(_weiAmount);
    require(_newContribution >= investorMinCap && _newContribution < investorHardCap);
    contributions[_beneficiary] = _newContribution;
  }
}
