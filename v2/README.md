

# Non-Fungible Propterty Tokens

In this example we'll import the standard ERC-721 Non-Fungible Token (NFT) from `open-zeppelin`. This will allow us to create a unique, ownable token for each unique address that chooses to participate in our property system. There is also the ability to create an auction contract and sell a property token to another user, but that falls outside the scope of these examples. For now, we will use an NFT to represent a property and setting a URI for the property data, which we can store off-chain and offer the URI as a public GET endpoint.

Relying on the ERC-721 contract we get the following functionality for each NFT:
* a unique ID
* set a URI for each ID
* enforced ownership of each ID
* transferability
* enumeration

In this example, we add a small amount of custom functions to our contract:
* creating a property
* setting the URI
* getting the URI

### A bit about NFTs
The way ERC-721 (a standard interface) is implemented in Solidty means that there is at least a mapping from every unique ID to an address so we know who is the owner of each unique ID. The IDs are implemented as unsigned 256 bit integers (uint256).
```
mapping (uint256 => address) internal tokenOwner;
```
The rest of the ERC-721 standard and Zeppelin contracts is rather complex due to the Zeppelin teams implementation. It relies heavily on inheritence and interfaces, a bit beyond the scope of these tutorials. However here are the most useful links for futher research:

The basic token functionality. Most of the functions you would need to reference are implemented here. This can be great for learning but it is quite a big contract and complex.
(ERC721BasicToken.sol)[https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721BasicToken.sol]

The minimum standard interface functions. This contract implements the above contract.
(ERC721Token.sol)[https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol]

The main interface, for using basic ERC-721 tokens from another contract. You would implement this to `cast` an address as an ERC-721 token so you can use it's functions directly from the calling contract. We'll do this later in our property examples.
(ERC721Basic.sol)[https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Basic.sol]

The root folder of all ERC-721 contracts.
(ERC721 Folder)[https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/token/ERC721]

## Property Contract
In our property contract, we'll add some custom logic to provide an `onlyOwner` function, create a property, set and get the URI for the specific token we own.

### Modifier and Mappings
Using the ERC-721 tokenOwner mapping, we'll pass in the argument of `_tokenId` to check if the transaction sender `msg.sender` is the owner of this token.

Mappings in Solidity are simply hash table key value stores.

NOTE: uninitialized values will always be zero. For address types that are uninitialized, like the `tokenOwner` mapping, the value will be equal to `address(0)`.
```
modifier onlyOwner(uint256 _tokenId) {
  require(tokenOwner[_tokenId] == msg.sender);
  _;
}
```
### Create Property
Now we want any user to be able to mint their own property tokens. We do this with an externally available function, that means it can be called ONLY outside this contract. We'll set the tokenId to be the next integer available, starting from 1.

Since all values are uninitialized in Solidity, we want to avoid using `0` as an ID or relying on uninitialized values for boolean logic.
```
function createProperty() external {
  _mint(msg.sender, allTokens.length + 1);
}
```
### Set and Get the URI
These functions simply wrap some of the existing functionality of the ERC-721 contract for convenience.

We'll use these to set the location of where our front-end or users will fetch the property data from.

Setting the URI will allow us to save an end point that can return a JSON object of property data.
