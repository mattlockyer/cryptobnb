//jshint ignore: start

// contracts
const Property = artifacts.require("./Property.sol");

/**************************************
* Tests
**************************************/

contract('Property Contract Tests', function(accounts) {
  
  let property;
  const message = 'hello world!'
  const alice = accounts[0], bob = accounts[1];
  
  it('should be deployed, Property', async () => {
    property = await Property.deployed();
    assert(property !== undefined, 'Property was NOT deployed');
  });
  
});
