//jshint ignore: start

pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract HelloWorld is Ownable {
  
  constructor() public {}
  //log string
  event Hello(string _msg);
  //trivial hello function, only owner can call
  function hello(string _msg) external onlyOwner {
    emit Hello(_msg); //note emit keyword
  }
  
}
