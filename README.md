

# Tutorial Series "cryptobnb"
Crypto bed and breakfast (Airbnb) example dapp tutorial done in stages.

These examples slowly build from a basic hello world example in `v0` and `v1` into a multi smart contract architecture using `open-zeppelin` contracts and 3 custom contracts.

## Getting Started (install)

In order to get started you're going to a need a Solidty smart contract development tool called `truffle` and you can install it using:
```
npm i -g truffle
```
Double check this installation went ok using:
```
truffle version
```
You should see a version number pop out.

Now you can hop into one of the sub folders like `v0` and open the truffle development console.

## Truffle Developer Console

Once inside a directory with a typical truffle file structure:
```
contracts/
migrations/
test/
truffle-config.js
truffle.js
...
```
You can launch the truffle developer console using:
```
truffle develop
```

### What does this do?

This launches a test blockchain on your device with 10 unlocked accounts, each containing 100 ether.

From inside your project folder and inside the developer console you can use the following truffle commands:
```
init      Initialize new and empty Ethereum project
compile   Compile contract source files
migrate   Run migrations to deploy contracts
deploy    (alias for migrate)
build     Execute build pipeline (if configuration present)
test      Run JavaScript and Solidity tests
debug     Interactively debug any transaction on the blockchain (experimental)
opcode    Print the compiled opcodes for a given contract
console   Run a console with contract abstractions and commands available
develop   Open a console with a local development blockchain
create    Helper to create new contracts, migrations and tests
install   Install a package from the Ethereum Package Registry
publish   Publish a package to the Ethereum Package Registry
networks  Show addresses for deployed contracts on each network
watch     Watch filesystem for changes and rebuild the project automatically
serve     Serve the build directory on localhost and watch for changes
exec      Execute a JS module within this Truffle environment
unbox     Download a Truffle Box, a pre-built Truffle project
version   Show version number and exit
```
You can look at these commands anytime by typing `truffle` in the command line (outside the developer console)

## Testing Contracts

The most important thing we're going to do with some of the early tutorials is test our smart contracts using javascript and the truffle developer console test runner.

The test runner uses the mocha / chai test framework if you're familiar. If not, don't worry it's simple.

You can run tests from the developer consoler by simply typing:
```
test
```
And outside the developer console by typing:
```
truffle test
```
However, each time you run the tests outside the developer console, truffle needs to spin up a whole new blockchain for testing.

It's much better to have 1 terminal window live in the developer console for running tests.

## Wrapping Up

That covers getting started with truffle.

Each sub-folder has it's own README.md where the smart contracts are explained in detail.

For additional installation instructions, running front-ends etc... these can also be found in the sub-folder tutorial README.md.

### Happy Truffling :)
