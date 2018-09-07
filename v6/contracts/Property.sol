//jshint ignore: start

pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract Property is ERC721Token {

  constructor(string _name, string _symbol) public ERC721Token(_name, _symbol) {
    //leave empty for now, we've passed through the args above (i.e. super)
  }

  modifier onlyOwner(uint256 _tokenId) {
    require(tokenOwner[_tokenId] == msg.sender);
    _;
  }

  function createProperty() external {
    _mint(msg.sender, allTokens.length + 1);
  }

  function setURI(uint256 _tokenId, string _uri) external onlyOwner(_tokenId) {
    _setTokenURI(_tokenId, _uri);
  }

  function getURI(uint256 _tokenId) external view returns(string) {
    return tokenURIs[_tokenId];
  }

  function getProperties() external view returns(uint256[]) {
    return ownedTokens[msg.sender];
  }

}
