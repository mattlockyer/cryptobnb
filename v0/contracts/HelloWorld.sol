//jshint ignore: start

pragma solidity ^0.4.24;

contract HelloWorld {
  //track the owner
  address internal owner;
  
  constructor() public {
    owner = msg.sender; //deployer of contract
  }
  //log string
  event Hello(string _msg);
  //protects functions from executing
  modifier onlyOwner {
    require(msg.sender == owner); //condition must be true
    _; //return to function and continue
  }
  //trivial hello function, only owner can call
  function hello(string _msg) external onlyOwner {
    emit Hello(_msg); //note emit keyword
  }
  //transfer ownership, only owner can call, returns new owner
  function transferOwnership(address _owner) external onlyOwner returns(address) {
    owner = _owner;
    return owner;
  }
  
}
