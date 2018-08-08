//jshint ignore: start

pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract Property is ERC721Token {
  
  constructor(string _name, string _symbol) public ERC721Token(_name, _symbol) {
    //can leave empty for now
  }
  
  // function addProperty() external {
    
  // }
  
}
