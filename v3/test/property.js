//jshint ignore: start

// contracts
const Property = artifacts.require("./Property.sol");

/**************************************
* Tests
**************************************/

contract('Property Contract Tests', function(accounts) {
  
  let property;
  const alice = accounts[0], bob = accounts[1];
  
  it('should be deployed, Property', async () => {
    property = await Property.deployed();
    assert(property !== undefined, 'Property was NOT deployed');
  });
  
  it('should have name "Property" and symbol "PROP"', async () => {
    const name = await property.name.call();
    const symbol = await property.symbol.call();
    assert(name === 'Property' && symbol === 'PROP', 'Name and Symbol are incorrect');
  });
  
  it('should allow alice to create a property with tokenId 1', async () => {
    const tx = await property.createProperty();
    //get the tokenId a the 0 index position
    const tokenId = await property.tokenOfOwnerByIndex.call(alice, 0);
    assert(tokenId.toNumber() === 1, 'tokenId is not 1');
  });
  
  it('should allow alice to set the URI for her property', async () => {
    const _uri = 'https://google.ca';
    const tx = await property.setURI(1, _uri);
    const uri = await property.getURI.call(1);
    assert(uri === _uri, 'URI was not set');
  });
  
  it('should NOT allow bob to set the URI for the property', async () => {
    const _uri = 'https://facebook.com';
    try {
      const tx = await property.setURI(1, _uri, { from: bob });
      assert(false, 'URI was set');
    } catch(e) {
      assert(true, 'URI was set');
    }
    const uri = await property.getURI.call(1);
    assert(uri !== _uri, 'URI was set when it SHOULD NOT BE');
  });
  
});
