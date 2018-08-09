//jshint ignore: start

// contracts
const Property = artifacts.require("./Property.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

/**************************************
* Tests
**************************************/

contract('Property Registry Contract Tests', function(accounts) {
  
  let property, propertyRegistry;
  const price = 1000;
  const alice = accounts[0], bob = accounts[1];
  
  it('should be deployed, Property', async () => {
    property = await Property.deployed();
    assert(property !== undefined, 'Property was NOT deployed');
  });
  
  it('should be deployed, PropertyRegistry', async () => {
    propertyRegistry = await PropertyRegistry.deployed();
    assert(propertyRegistry !== undefined, 'PropertyRegistry was NOT deployed');
  });
  
  it('should allow alice to create a property with tokenId 1', async () => {
    const tx = await property.createProperty();
    //get the tokenId a the 0 index position
    const tokenId = await property.tokenOfOwnerByIndex.call(alice, 0);
    assert(tokenId.toNumber() === 1, 'tokenId is not 1');
  });
  
  it('should allow alice register her property in the PropertyRegistry', async () => {
    const tx = await propertyRegistry.registerProperty(1, price);
    //get the tokenId a the 0 index position
    const data = await propertyRegistry.stayData.call(1);
    assert(data[0].toNumber() === price, 'tokenId is not 1');
  });
  
  it('should NOT allow bob register her property', async () => {
    try {
      const tx = await propertyRegistry.registerProperty(1, price * 2, { from: bob });
      assert(false, 'bob registered the property');
    } catch(e) {
      assert(true, 'bob registered the property');
    }
    //get the tokenId a the 0 index position
    const data = await propertyRegistry.stayData.call(1);
    assert(data[0].toNumber() !== price * 2, 'bob registered the property');
  });
  
});
