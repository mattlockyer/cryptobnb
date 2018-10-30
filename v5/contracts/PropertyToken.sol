//jshint ignore: start

pragma solidity ^0.4.24;

import '../../vendor/zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';
import '../../vendor/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract PropertyToken is DetailedERC20, MintableToken {
  
  //set up the property contract as minimum interface to prove ownership ERC721Basic
  constructor(string _name, string _symbol, uint8 _decimals) public DetailedERC20(_name, _symbol, _decimals) {
    
  }
  
}
