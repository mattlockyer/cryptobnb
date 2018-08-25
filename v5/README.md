

# Cross Contract Interactions

## Introducing Property Token and Registering a Property

In this example we're going to be adding a standard ERC20 token and using this token as our `unit of account` to make payments in the property registry.

`PropertyToken.sol` is a simple contract importing 2 open zeppelin contracts:
```
import 'zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';
import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
```
These two contracts come with all the features we need to represent an ERC20. In our test cases, as always, `account[0]` is the owner, so they will be able to mint and transfer the property tokens.

`account[0]` is the owner of any deployed contracts that implement `Ownable.sol` like `MintableToken.sol` does. This is exactly the same as our hello world examples from `v0` and `v1`.

Now that we have property tokens, a guest should be able to check in and check out with their balance of property tokens being debited while the owner will be credited. This will be handled largely in `PropertyRegistry.sol` so let's take a look at some of the functions we've added.

The first is to maintain a reference to the deployed instance of `PropertyToken.sol` like we did with the ERC721 tokens from `Property.sol` in the previous example `v3`. Here are the relevant portions of code for that:
```
...
import 'zeppelin-solidity/contracts/token/ERC20/ERC20.sol';
contract PropertyRegistry {
  ERC20 propertyToken;
  ...
  //add Property and PropertyToken minimum interfaces to this contract
  constructor(address _property, address _propertyToken) public {
    property = ERC721Basic(_property);
    propertyToken = ERC20(_propertyToken);
  }
  ...
}
```
You can see we're importing the `ERC20.sol` interface so we can also pass in the deployed address of `PropertyToken.sol` and call it's methods.

Now we need to integrate property tokens with our business logic in the property registry.

The first change is to our struct since we'll be dealing with a lot more logic in this example:
```
struct Data {
  uint256 price;
  uint256 stays;
  address requested;
  address approved;
  address occupant;
  uint256 checkIn;
  uint256 checkOut;
}
```
We've added 3 address fields to handle the requested, approved and occupant user. Also we've added a checkIn and checkOut

We're going to need to maintain a mapping from each property `tokenId` owned by users to some data storage in the registry (think application state). We'll use a mapping from `uint256` to a custom data type called a `struct`.

Here's the mapping:
```
mapping(uint256 => Data) public stayData;
```
Pretty straightforward and the `Data` datatype is:
```
struct Data {
  uint256 price;
  uint256 stays;
  address occupant;
}
```
We'll need to add more data fields to this struct in later examples but this should be enough to register the property with the registry.

In order to check that the user registering the property owns the ERC721 token that represents their property, we'll need to import the interface for ERC721 into this contract. This is so we can cast the address of the deployed `Property.sol` contract as an ERC721 and use it's methods.
```
import 'zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol';
```
We'll also need to store the address of the deployed `Property.sol` contract. We do this by passing it into the constructor of the `PropertyRegistry.sol` contract upon deployment of the registry. This will ensure we can reference the ERC721 tokens that represent properties users want to list and we can verify they own those properties.
```
//set up the property contract as minimum interface to prove ownership ERC721Basic
constructor(address _property) public {
  property = ERC721Basic(_property);
}
```
Notice we cast the address argument to the constructor as ERC721Basic. This is so we can use functions like `property.ownerOf(_tokenId)` in our modifiers for the registry and protect functions from illicit use by people who are not the owners of those properties.

Here's how we protect the `registerProperty` function.
```
modifier onlyOwner(uint256 _tokenId) {
  require(property.ownerOf(_tokenId) == msg.sender);
  _;
}
...
function registerProperty(uint256 _tokenId, uint256 _price) external onlyOwner(_tokenId) {
  stayData[_tokenId] = Data(_price, 0, address(0));
}
```
We pass the `_tokenId` argument to the modifier and call the function of the `property` contract that checks `ownerOf` since we have it casted as the `ERC721Basic.sol` interface.

That's it for now! Getting more complex in the next 2 examples!
