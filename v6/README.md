

# Building Your First Dapp

## Updates to Contracts

Updates to `PropertyRegistry.sol`:
* added events
* added view function for stayData

Updates to `Property.sol`:
* added view function to return all properties

### Events
Events are a simple way to log a transaction on the blockchain. Event logs are currently stored forever, but this will NOT always be the case, so it's important not to rely on them too heavily.

However, events are also how we can listen to the blockchain from our front-end Dapp so it's necessary to emit events in order to respond to changes in our smart contract state.

Here's an example of an event:
```
event CheckIn(uint256 indexed _tokenId);
...
function checkIn(uint256 _tokenId) external {
  //successful check in
  ...
  emit CheckIn(_tokenId);
}
```
Here we are going to track the property token id that was used when the `checkIn` function was called by emitting an event called `CheckIn` note the case sensitivity.

### View Functions
These functions are called `view` because they do not change state. A `pure` function will NOT read state either, making it a subset of `view` specifically for mathematical operations only.

Because `ownedTokens` is an `internal` variable in the `ERC721BasicToken.sol` contract, we have to create a custom `view` function to return it's contents:
```
function getProperties() external view returns(uint256[]) {
  return ownedTokens[msg.sender];
}
```
We can return arrays of `int` and `address` but NOT custom data types, yet...

# THE FRONT-END

Our html/js Dapp needs to communicate with:
1. Our local blockchain
2. The Ethereum blockchain

We do this by using the code provided by the Ethereum Foundation, this is `web3.js`.

We also need to create instances of our smart contracts in JavaScript so that we can sign transactions on behalf of the users and make the appropriate JSON/RPC calls. We will use `TruffleContract` for that.

### Notes on versions

TruffleContract and Web3.js version < 1.0 work well together, for now...

Truffle is built around the stable version of Web3, not the beta version which included some breaking changes.

NOTE: a lot of this is subject to change. For instance JSON/RPC will be replaced by WebSockets soon.

## Setting up your Dapp

Include the following in your `<head>` section:
```
<script src="https://cdn.rawgit.com/ethereum/web3.js/develop/dist/web3.js"></script>
<script src="https://cdn.rawgit.com/trufflesuite/truffle-contract/develop/dist/truffle-contract.js"></script>
```
FYI: if these branches change, you likely have an issue with truffle not being compatible with web3 and should find versions that are compatible.

## Connecting to a Web3 provider (blockchain)

For convenience and reuse in other projects, I put general functions into a Utils object that is global. This is of course if you're not already using ES6 modules / imports.

Here is the function that will check for an already present (injected) `web3` instance. If it does not find one, it will create one for the `host` address that is provided to the function.

```
const Utils = {
  ...
  async getWeb3 = (host) => {
    // Is there an injected web3 instance?
    let web3Provider;
    if (typeof web3 !== 'undefined') {
      web3Provider = web3.currentProvider;
    }
    else {
      // If no injected web3 instance is detected, fall back to Ganache
      web3Provider = new Web3.providers.HttpProvider(host);
    }
    window.web3 = new Web3(web3Provider);
  }
  ...
}
```

To connect to the `truffle develop` console. Use the host address: `http://127.0.0.1:9545/`.

## Loading the Truffle Artifacts

In order to connect to our contract using TruffleContract, we have to load the artifact that Truffle produced after we compiled the contract.

We'll use a simple `fetch` call.
```
const json = await fetch('../path/to/build/contracts/MyContract.json').then((res) => res.json());
```
Once we have this json we can easily create a TruffleContract object:
```
const Utils = {
  ...
  async getContract(json, address, web3 = window.web3) {
    const contract = TruffleContract(json);
    contract.setProvider(web3.currentProvider);
    return address ? contract.at(address) : contract.deployed();
  }
  ...
}
```
Again for convenience I've put this into a Utils object.

Note the address and web3 parameters. These could be used to fetch a live instance of our contract running on another blockchain network. In fact this MUST be used when our contracts are deployed live on a testnet or the Ethereum mainnet in order to specify which contracts we want.

## What's the Address of MyContract?
One of the great things about using TruffleContract is that it automatically finds the latest deployed contract for you on the local blockchain you would be using with the truffle development console.

Simply type:
```
migrate --reset all
```
And all your contracts will be re-compiled and re-deployed on the local blockchain.

TruffleContract will also pick up the latest versions when you go to test your Dapp again.

## Getting Accounts

Remember Alice and Bob from our tests? Here they are again:
```
const { accounts } = web3.eth;
const alice = accounts[0];
const bob = accounts[1];
```
NOTE this must be done after web3 is initialized. This stumps a lot of people. The best is to use the web3 callbacks or promisify those callbacks if you'd like to use async / await.

## Making a Transaction

Let's assume Alice wants to create a property and the contract instance is `Property.contract`. The transaction to call is no different than our tests:
```
qs('#create-property-alice').onclick = async () => {
  try {
    const tx = await Property.contract.createProperty({
      from: alice,
      gas: 250000
    });
    console.log(tx);
    console.log('Property Created for Alice');
  } catch(e) {
    console.log(e);
    alert('Error creating property', e)
  }
}
```

## Finishing the Dapp

We've created plain JavaScript objects for every contract, `Property`, `PropertyRegistry` and `PropertyToken`.

These objects are connecting to the local development blockchain and provided you have migrated your contracts, they will have the latest version.

Now you can boot up the front-end of this example using any simple webserver and navigate to:
```
localhost:[port]/app
```



