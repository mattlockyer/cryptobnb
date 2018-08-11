

# Hello World (if you're the owner)

In this example we're going to walk through a simple hello world function that accepts a string argument and emits an Event to the Ethereum Blockchain.

You will be testing locally on your machine so this won't actually be recorded on the main network or a test network, but you will see and hopefully understand the use of the following Solidity concepts:
* using state
* a constructor
* a modifier
* the require function
* a custom external function
* a custom function using a modifier
* an event
* a return statement

State: we can store state in our smart contracts like addresses, integers, mappings and arrays.
```
address internal owner;
```
Constructors: these are called once when you deploy your contract.
```
constructor() public {
  owner = msg.sender; //deployer of contract
}
```
Modifiers: these are special functions that can be reused by 'decorating' other functions with a call to them. They will use the `require(...)` function to determine if they should resume the calling function's execution. To resume calling function execution we use `_;`
```
modifier onlyOwner {
  require(msg.sender == owner); //condition must be true
  _; //return to function and continue
}
```
Custom Functions: these are named by developers, given a visibility such as `external` so they can be called from outside the contract and can have modifiers previously defined added to them by using the modifier name. Modifiers can also have parameters and accept arguments.
```
function hello(string _msg) external onlyOwner {
  emit Hello(_msg); //note emit keyword
}
```
Events: events are special functions that will be logged on the blockchain along with the arguments used. To call an event you must use the `emit` keyword.
```
event Hello(string _msg);
```
Return statements: you can return 1 or more variables in Solidity. If you return one, the value will be returned. If you return more than one, an array of values will be returned. When using web3 you must use the `functionName.call(...)` syntax in order to return the value. Typically, you would use this to read data from the blockchain. In the case of calling a state changing function that returns, you can always use the `.call(...)` syntax prior to calling the function directly and changing state in order to verify execution.
```
function transferOwnership(address _owner) external onlyOwner returns(address) {
  owner = _owner;
  return owner;
}
```
