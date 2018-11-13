//jshint ignore: start

pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol';
import 'zeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract PropertyRegistry {
  
  // This request struct will have the checkin, checkout and approval boolean
  struct Request {
    uint256 checkIn;
    uint256 checkOut;
    bool approved;
  }

  ERC721Basic property;
  ERC20 propertyToken;

  // We keep the price, amount of stays and current occupant of our room
  // The requests mapping keeps track of all requests made by specific addresses
  struct Data {
    uint256 price;
    uint256 stays;
    address occupant;
    mapping(address => Request) requests;
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
    stayData[_tokenId] = Data(_price, 0, address(0));
  }
  
  // To approve a request, we now need to send in which address we are approving for
  function approveRequest(uint256 _tokenId, address _for) external onlyOwner(_tokenId) {
    stayData[_tokenId].requests[_for].approved = true;
  }
  
  // Requesting a property is simple, we simply send in which property and our checkin and checkout time
  function request(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) external {
    stayData[_tokenId].requests[msg.sender] = Request(_checkIn, _checkOut, false);
  }

  // Checking in gethers our request, and validates that the transfer of tokens works
  function checkIn(uint256 _tokenId) external {
    // Get the request from the msg sender
    Request storage req = stayData[_tokenId].requests[msg.sender];
    // Ensure it is approved
    require(req.approved == true);
    // Ensure we are within the checkin window
    require(now > req.checkIn && now < req.checkOut);
    // Ensure there is no occupant to the room
    require(stayData[_tokenId].occupant == address(0));
    //REQUIRED: transfer tokens to propertyRegistry upon successful check in
    //this == this contract address
    require(propertyToken.transferFrom(msg.sender, address(this), stayData[_tokenId].price));
    // Change the current occupant to the checked in guest
    stayData[_tokenId].occupant = msg.sender;
  }
  
  // Checkout gathers our approved requests and does the checkout
  function checkOut(uint256 _tokenId) external {
    Request storage req = stayData[_tokenId].requests[msg.sender];
    // Ensure we are dealing with the occupant.
    require(stayData[_tokenId].occupant == msg.sender);
    // Ensure we are before the checkout time
    require(now < req.checkOut);
    //REQUIRED: transfer tokens to Alice upon successful check out
    require(propertyToken.transfer(property.ownerOf(_tokenId), stayData[_tokenId].price));
    //clear the request to let another guest request
    stayData[_tokenId].occupant = address(0);
    stayData[_tokenId].stays++;
  }

  // Simple getter to get the requests per tokenID and from address
  function getRequests(uint256 _tokenId, address _from) public view returns(uint256 _checkIn, uint256 _checkout, bool _approved) {
    Request storage req = stayData[_tokenId].requests[_from];
    return (req.checkIn, req.checkOut, req.approved);
  }
  
  
}
