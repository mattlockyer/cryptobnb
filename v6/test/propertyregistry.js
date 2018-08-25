//jshint ignore: start

// contracts
const Property = artifacts.require("./Property.sol");
const PropertyToken = artifacts.require("./PropertyToken.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

/**************************************
* Tests
**************************************/

contract('Property Registry Contract Tests', function(accounts) {
  
  let property, propertyToken, propertyRegistry;
  const price = 1000;
  const allocation = 10000;
  const alice = accounts[0], bob = accounts[1];
  
  it('should be deployed, Property', async () => {
    property = await Property.deployed();
    assert(property !== undefined, 'Property was NOT deployed');
  });
  
  it('should be deployed, PropertyToken', async () => {
    propertyToken = await PropertyToken.deployed();
    assert(propertyToken !== undefined, 'PropertyToken was NOT deployed');
  });
  
  it('should be deployed, PropertyRegistry', async () => {
    propertyRegistry = await PropertyRegistry.deployed();
    assert(propertyRegistry !== undefined, 'PropertyRegistry was NOT deployed');
  });
  
  /**************************************
  * Using Property Tokens
  **************************************/
  
  it('should allow alice to mint Property Token for bob', async () => {
  
    console.log('Property Token Integration');
    
    const tx = await propertyToken.mint(bob, allocation);
    //get the balance of property tokens for bob
    const balance = await propertyToken.balanceOf.call(bob);
    assert(balance.toNumber() === allocation, 'balance');
  });
  
  it('should allow bob to approve the property registry to use his tokens', async () => {
    const tx = await propertyToken.approve(propertyRegistry.address, price, { from: bob });
    assert(tx !== undefined, 'property registry has not been approved');
  });
  
  /**************************************
  * Resume Property Registry tests using Tokens
  **************************************/
  
  it('should allow alice to create a property with tokenId 1', async () => {
    
    console.log('Using Property Registry with Tokens (paying for check in)');
    
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
    //get the data for tokenId 1 in the registry
    const data = await propertyRegistry.stayData.call(1);
    assert(data[0].toNumber() !== price * 2, 'bob registered the property');
  });
  
  it('should allow bob to request to stay at property "1"', async () => {
    const tomorrow = new Date();
    //uncomment the next 2 lines to set checkIn for tomorrow at 4pm
    //tomorrow.setDate(tomorrow.getDate()+1);
    //const checkIn = tomorrow.setHours(16, 0, 0, 0) / 1000;
    const checkIn = tomorrow.setHours(0, 0, 0, 0) / 1000; //today at 12am (for testing)
    //uncomment the next 2 lines and comment the following line (for testing)
    //tomorrow.setDate(tomorrow.getDate()+2) / 1000;
    //const checkOut = tomorrow.setHours(11, 0, 0, 0) / 1000;
    const checkOut = tomorrow.setHours(23, 59, 0, 0) / 1000; //today at 11:59pm (for testing)
    const tx = await propertyRegistry.request(1, checkIn, checkOut, { from: bob });
    //get the tokenId a the 0 index position
    const data = await propertyRegistry.stayData.call(1);
    assert(data[2] === bob, 'bob is not the requested guest for property "1"');
  });
  
  it('should NOT allow bob to approve the request', async () => {
    try {
      const tx = await propertyRegistry.approveRequest(1, { from: bob });
      assert(false, 'bob registered the property');
    } catch(e) {
      assert(true, 'bob registered the property');
    }
    //get the data for tokenId 1 in the registry
    const data = await propertyRegistry.stayData.call(1);
    assert(data[3] !== bob, 'bob approved his own stay');
  });
  
  it('should allow alice to approve the request at property "1"', async () => {
    const tx = await propertyRegistry.approveRequest(1);
    //get the tokenId a the 0 index position
    const data = await propertyRegistry.stayData.call(1);
    assert(data[3] === bob, 'bob is not the approved guest for property "1"');
  });
  
  it('should allow bob to checkIn at property "1"', async () => {
    const tx = await propertyRegistry.checkIn(1, { from: bob });
    //get the tokenId a the 0 index position
    const data = await propertyRegistry.stayData.call(1);
    assert(data[4] === bob, 'bob is not able to check in');
  });
  
  it('should allow bob to checkOut at property "1"', async () => {
    const tx = await propertyRegistry.checkOut(1, { from: bob });
    //get the tokenId a the 0 index position
    const data = await propertyRegistry.stayData.call(1);
    assert(data[2] !== bob, 'bob was not able to check out');
  });
  
  it('should have paid alice the tokens for the stay', async () => {
    const data = await propertyRegistry.stayData.call(1);
    assert(data[1].toNumber() === 1, 'stay was not recorded');
  });
  /**************************************
  * Check token balance
  **************************************/
  it('should have paid alice the tokens for the stay', async () => {
    console.log('Property Token Balance Check for Alice');
    const balance = await propertyToken.balanceOf.call(alice);
    assert(balance.toNumber() === price, 'alice token balance is wrong');
  });
  
});
