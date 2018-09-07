//jshint ignore: start

pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract PropertyRegistry {

  //data
  ERC721Basic property;
  ERC20 propertyToken;
  struct Data {
    uint256 price;
    uint256 stays;
    address requested;
    address approved;
    address occupant;
    uint256 checkIn;
    uint256 checkOut;
  }
  mapping(uint256 => Data) public stayData;

  //modifier leveraging property contract
  modifier onlyOwner(uint256 _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender);
    _;
  }

  //add Property and PropertyToken minimum interfaces to this contract
  constructor(address _property, address _propertyToken) public {
    property = ERC721Basic(_property);
    propertyToken = ERC20(_propertyToken);
  }

  /**************************************
  * Owner functions
  **************************************/
  function registerProperty(uint256 _tokenId, uint256 _price) external onlyOwner(_tokenId) {
    stayData[_tokenId] = Data(_price, 0, address(0), address(0), address(0), 0, 0);
  }

  function approveRequest(uint256 _tokenId) external onlyOwner(_tokenId) {
    stayData[_tokenId].approved = stayData[_tokenId].requested;
  }

  /**************************************
  * Guest Functions
  **************************************/
  function request(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) external {
    require(stayData[_tokenId].requested == address(0)); //no one requested
    stayData[_tokenId].requested = msg.sender;
    stayData[_tokenId].checkIn = _checkIn;
    stayData[_tokenId].checkOut = _checkOut;
  }

  function checkIn(uint256 _tokenId) external {
    require(stayData[_tokenId].approved == msg.sender);
    require(now > stayData[_tokenId].checkIn);
    stayData[_tokenId].occupant = stayData[_tokenId].approved;
  }

  function checkOut(uint256 _tokenId) external {
    require(stayData[_tokenId].occupant == msg.sender);
    require(now < stayData[_tokenId].checkOut);
    stayData[_tokenId].requested = address(0);
  }

}
