pragma solidity ^0.8.17;

import "./Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MintedCrowdsale
 * @dev Extension of Crowdsale contract whose tokens are minted in each purchase.
 * Token ownership should be transferred to MintedCrowdsale for minting.
 */
contract MintedCrowdsale is Crowdsale {
  /**
   * @dev Overrides delivery by minting tokens upon purchase.
   * @param _beneficiary Token purchaser
   * @param _tokenAmount Number of tokens to be minted
   */
  function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal override {
    // Potentially dangerous assumption about the type of the token.
    require(ERC20(address(token)).mint(_beneficiary, _tokenAmount));
  }
}
