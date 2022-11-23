// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DappToken is ERC20, ERC20Pausable, Ownable {
  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Pausable) whenNotPaused {
    super._beforeTokenTransfer(from, to, amount);
    require(!paused(), "ERC20Pausable: token transfer while paused");
  }
}
