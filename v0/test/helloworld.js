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
    assert(helloWorld !== undefined, 'HelloWorld was not deployed');
  });
  
  it('should let Alice say "' + message + '"', async () => {
    const tx = await helloWorld.hello(message); //say the message value
    const msg = tx.logs[0].args._msg; //get the message out of the transaction log arguments
    assert(msg === message, 'Alice could not say "' + message + '"');
  });
  
});
