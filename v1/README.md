

# Hello Open Zeppelin

In this example we're going to import a simple `open-zeppelin` smart contract that adds all the functionality of owning a contract and transfering ownership.

You'll see how the custom logic of our contract becomes more simplified.

In this example you'll understand the use of the following Solidity concepts:
* imports
* inheritence
* constructors (in depth)

Imports: we can import the code from other smart contracts similar to a ruby or javascript style import statement. For contracts that are in the `node_modules` folder, we only need to start with the root sub-folder. In our case that will be `zeppelin-solidity`.
```
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
```
Inheritence: contracts can `be` the type of an imported contract, or implement an interface if the contract has not fully implemented it's methods.

To do this we use the `is` keyword.
```
contract HelloWorld is Ownable { ... }
```
This means that every deployed instance of `HelloWorld.sol` is now also of the type `Ownable.sol`. Just like classical inheritence patterns, `HelloWorld.sol` will inherit all the member variables and functions of `Ownable.sol` except the contrutor.

Constructors: let's imagine the `Ownable.sol` contract had a parameter to it's constructor. This means that if `HelloWorld.sol` is deployed, it must provide an argument to the constructor of `Ownable.sol`. Here's how we would do that:
```
//Ownable.sol
constructor(address _owner) public { ... }

//HelloWorld.sol
contract HelloWorld is Ownable {
  ...
  constructor() public Ownable(msg.sender) { ... }
  ...
}
```
