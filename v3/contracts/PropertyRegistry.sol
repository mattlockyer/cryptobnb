//jshint ignore: start

pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol';

contract PropertyRegistry {

  //data
  ERC721Basic property;
  struct Data {
    uint256 price;
    uint256 stays;
    address occupant;
  }
  mapping(uint256 => Data) public stayData;

  //modifier leveraging property contract
  modifier onlyOwner(uint256 _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender);
    _;
  }

  //set up the property contract as minimum interface to prove ownership ERC721Basic
  constructor(address _property) public {
    property = ERC721Basic(_property);
  }

  function registerProperty(uint256 _tokenId, uint256 _price) external onlyOwner(_tokenId) {
    stayData[_tokenId] = Data(_price, 0, address(0));
  }

}
