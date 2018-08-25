

# Cross Contract Interactions

## Working with Time

In this example we're going to be working with the concept of time on the blockchain. Using some special keywords and storing timestamps in our `stayData` struct we'll be able to enforce check in and check out times.

First we'll have to update our struct in `PropertyRegistry.sol`:
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
We've added 3 address fields as we'll have to move our user through the business logic from requested to approved to occupant. We'll also need to keep track of valid check in and check out times.

We've added 3 guest functions to the contract as well:
* request
* checkIn
* checkOut

Let's take a look at each function in detail starting with request:
```
function request(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) external {
  require(stayData[_tokenId].requested == address(0)); //no one requested
  stayData[_tokenId].requested = msg.sender;
  stayData[_tokenId].checkIn = _checkIn;
  stayData[_tokenId].checkOut = _checkOut;
}
```
In this function a guest will specify which property they want to request to stay at using the `_tokenId` and also provide a check in and check out time in the form of a time stamp.

We will have to check the mapping of `tokenId` to `stayData` in order to ensure no one else is requesting to stay at the property.

Before we proceed to check in and check out, we'll need to check an additional owner function that we've added in order to approve the request:
```
function approveRequest(uint256 _tokenId) external onlyOwner(_tokenId) {
  stayData[_tokenId].approved = stayData[_tokenId].requested;
}
```
Again, this function is protected by our modifier that checks the sender is the owner of this property then approves the request by setting the approved address of the `stayData` mapping for this property to the requested address.

The next step is to check in where we'll be working with time.
```
function checkIn(uint256 _tokenId) external {
  require(stayData[_tokenId].approved == msg.sender);
  require(now > stayData[_tokenId].checkIn);
  stayData[_tokenId].occupant = stayData[_tokenId].approved;
}
```
Notice that once we check to make sure the sender is the approved address, we'll check the `stayData` field `checkIn` against the special keyword `now` to ensure the user is checking in AFTER the requested check in time.

If everything goes according to plan the first 2 require statements should not through an error and we'll get to check into this property, setting the occupant field to the address of the approved user for this property.

Now we'll need to check out:
```
function checkOut(uint256 _tokenId) external {
  require(stayData[_tokenId].occupant == msg.sender);
  require(now < stayData[_tokenId].checkOut);
  stayData[_tokenId].requested = address(0);
}
```
Here we're going to use a similar time check using the `now` keyword, but instead we're checking that now is in fact earlier than the requested check out time, to ensure we're checking out beforehand.

The last step is to set the requested address to the `zero address` in order to let the whole loop play all over again.
