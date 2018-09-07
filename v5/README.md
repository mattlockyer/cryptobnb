

# Cross Contract Interactions

## Introducing Property Token and Registering a Property

In this example we're going to be adding a standard ERC20 token and using this token as our `unit of account` to make payments in the property registry.

`PropertyToken.sol` is a simple contract importing 2 open zeppelin contracts:
```
import 'openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
```
These two contracts come with all the features we need to represent an ERC20. In our test cases, as always, `account[0]` is the owner, so they will be able to mint and transfer the property tokens.

`account[0]` is the owner of any deployed contracts that implement `Ownable.sol` like `MintableToken.sol` does. This is exactly the same as our hello world examples from `v0` and `v1`.

Now that we have property tokens, a guest should be able to check in and check out with their balance of property tokens being debited while the owner will be credited. This will be handled largely in `PropertyRegistry.sol` so let's take a look at some of the functions we've added.

The first is to maintain a reference to the deployed instance of `PropertyToken.sol` like we did with the ERC721 tokens from `Property.sol` in the previous example `v3`. Here are the relevant portions of code for that:
```
...
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
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

Now we need to integrate property tokens with our business logic in the property registry, specifically the payment of property tokens upon check in to the property.

So nothing needs to be done about requesting and approval, unless this was in some way our logic. Typically a property would charge upon check in or check out.

In order to successfully pay for the stay upon check in however, our user will need some tokens. So in the test, we've minted some tokens from the owner `account[0]` let's call, `alice`, to the user at `account[1]` who we've called `bob`.
```
const alice = accounts[0], bob = accounts[1];
...
it('should allow alice to mint Property Token for bob', async () => {
  const tx = await propertyToken.mint(bob, allocation);
  //get the balance of property tokens for bob
  const balance = await propertyToken.balanceOf.call(bob);
  assert(balance.toNumber() === allocation, 'balance');
});
...
```
Now that `bob` has property tokens he should be able to check in and transfer those tokens to `alice` the property owner. There's just one problem...
```
function checkIn(uint256 _tokenId) external {
  require(stayData[_tokenId].approved == msg.sender);
  require(now > stayData[_tokenId].checkIn);
  //REQUIRED: transfer tokens to propertyRegistry upon successful check in
  //this == this contract address
  require(propertyToken.transferFrom(msg.sender, this, stayData[_tokenId].price));
  //move approved guest to occupant
  stayData[_tokenId].occupant = stayData[_tokenId].approved;
}
```
When `bob` calls a function of the property registry and the property registry calls a function of the property token contract. The `msg.sender` of the transaction is no longer `bob`, it's the deployed instance of `PropertyRegistry.sol`, the actual contract address calling the property token contract. Hmmm...

So you'll notice in our tests that `bob` must first approve the transfer of his property tokens with `PropertyToken.sol` by calling the `approve(address,uint256)` method:
```
it('should allow bob to approve the property registry to use his tokens', async () => {
  const tx = await propertyToken.approve(propertyRegistry.address, price, { from: bob });
  assert(tx !== undefined, 'property registry has not been approved');
});
```
This means that the property registry is now approved to send a specified amount of property tokens from the balance belonging to `bob` to whomever they want. Since the property registry is a smart contract, there should be sufficient logic to ensure this only happens with a function that `bob` himself can control, such as checking into a property.

Here's the key part of the check in function again:
```
require(propertyToken.transferFrom(msg.sender, this, stayData[_tokenId].price));
```
Notice we're transferring the tokens to the property registry itself. Why is that?

We want to keep these tokens in `escrow` held in the contract before paying them out to `alice`. We'll transfer them again once `bob` checks out.
```
function checkOut(uint256 _tokenId) external {
  require(stayData[_tokenId].occupant == msg.sender);
  require(now < stayData[_tokenId].checkOut);
  //REQUIRED: transfer tokens to Alice upon successful check out
  require(propertyToken.transfer(property.ownerOf(_tokenId), stayData[_tokenId].price));
  //clear the request to let another guest request
  stayData[_tokenId].requested = address(0);
  stayData[_tokenId].stays++;
}
```
The key piece being:
```
require(propertyToken.transfer(property.ownerOf(_tokenId), stayData[_tokenId].price));
```
Notice we don't need to use `transferFrom(...)` and instead do a straight transfer to the owner of the property because the property registry actually holds the property tokens.

## Wrapping Up

For the smart contract portion of the tutorial that about covers things.

In `v6` we'll see a super simple web front-end wrapped around `v5` in order see how we connect with our development blockchain and send transactions from a web based ui.

## A Note on Tests

Keep in mind that tests are essentially the transactions as we will use in our web front-end.

They use `trufflecontract.js` and `web3.js` to send transactions to the blockchain based on an `http provider` that provides an `http` connection to the blockchain. These transactions are simply encoded and privately signed payloads broadcasted to the blockchain through the provider.

## Future Work and Challenges

How would you set up the `stayData` struct in order to allow multiple requests and stays at once, as long as the times didn't conflict.

Bear in mind this is a massive overhaul that will require changes to existing functions, arrays, looping and likely some additional functions.

It is recommended to add things incrementally and always write some straightforward tests to check things.

### Handling Multiple Requests

Let's first start by handling multiple requests and we'll leave the rest of the functionality as a challenge.

In order to do this efficiently you will need to bundle the checkIn and checkOut variables as their own struct.
```
struct Request {
  uint256 checkIn;
  uint256 checkOut;
}
```
Then add a mapping of these to the `stayData` struct, using the address of the requestor as a key:
```
struct Data {
  uint256 price;
  uint256 stays;
  address requested[];
  address approved[];
  address occupant[];
  mapping(address => Request) requests;
}
```
We also want to store a dynamic array of the requested addresses so we know which keys to use for the mapping for the check in and check out logic later.

Following the logic from this `v4` example we'll also need dynamic arrays for `approved` and `occupant`.

Now with each new request, we'll simply add a new Request datatype to the mapping using the address of the requestor as a key.
```
function request(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) external {
  require(stayData[_tokenId].requested == address(0)); //no one requested
  stayData[_tokenId].requested.push(msg.sender);
  stayData[_tokenId].requests[msg.sender] = Request(_checkIn, _checkOut);
}
```
For approval we'll need to specify exactly which address we're approving for. We can also return an array of all addresses requesting the property using a simple view function.

We'll probably want change our logic for approval, checkIn and checkOut but leave that as an exercise.