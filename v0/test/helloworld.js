//jshint ignore: start

// contracts
const HelloWorld = artifacts.require("./HelloWorld.sol");

/**************************************
* Tests
**************************************/

contract('HelloWorld Contract Tests', function(accounts) {
  
  let helloWorld;
  const message = 'hello world!'
  const alice = accounts[0], bob = accounts[1];
  
  it('should be deployed, HelloWorld', async () => {
    helloWorld = await HelloWorld.deployed();
    assert(helloWorld !== undefined, 'HelloWorld was NOT deployed');
  });
  
  it('should let Alice say "' + message + '"', async () => {
    const tx = await helloWorld.hello(message); //say message value
    const msg = tx.logs[0].args._msg; //get _msg arg out of the transaction log arguments
    assert(msg === message, 'Alice could NOT say "' + message + '"');
  });
  
  it('should NOT let Bob say "' + message + '"', async () => {
    try {
      const tx = await helloWorld.hello(message, { from: bob }); //say message value from Bob
      assert(false, 'Bob COULD say "' + message + '"'); //if we can do this, something wrong
    } catch(e) {
      assert(true, 'Bob could say "' + message + '"');//this should happen
    }
  });
  
  it('should let Alice transfer ownership to Bob', async () => {
    //first use 'call' to get return value
    const newOwner = await helloWorld.transferOwnership.call(bob);
    assert(newOwner === bob, 'Bob is NOT the new owner');
    const tx = await helloWorld.transferOwnership(bob);
    assert(tx !== undefined, 'transaction failed, transferOwnership');
  });
  
  it('should let Bob say "' + message + '"', async () => {
    const tx = await helloWorld.hello(message, { from: bob }); //say message value, from bob
    const msg = tx.logs[0].args._msg; //get _msg arg out of the transaction log arguments
    assert(msg === message, 'Bob could NOT say "' + message + '"');
  });
  
});
