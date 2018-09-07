---

---

## W3 -- Solidity, the main language for smart contracts

This is the second tutorial in our Hello series.

1. [**Hello Blockchain**](/9e8807cd-b87d-4f8e-9d21-ec044be3e79f) - write and deploy a smart contract to a Ganache test chain and interact with it using the command line
2. **Hello Truffle** - write and deploy a smart contract to a test chain and interact with it using the Truffle develop console


Truffle is a smart contract framework that makes it easy to build smart contracts and deploy them to a blockchain. In this tutorial you will use the `Hello.sol` contract from the Hello Blockchain tutorial, build a Truffle project around it, and use Truffle to deploy and interact with it on the Ganache CLI test chain.

To begin, create a new folder called HelloTruffle, and change into it.

```terminal
mkdir HelloTruffle

$ cd HelloTruffle
```

You should have already installed Truffle in the setup for this week, but in case you have not, install it now:

```terminal
npm install -g truffle
```

Then, initialize your Truffle package by running:

```terminal
truffle init
```

This will create a few subdirectories and files that we will use to configure our deployment.


- **contracts/:** Directory for Solidity contracts
- **migrations/:** Directory for scriptable deployment files
- **test/:** Directory for test files for testing your application and contracts
- **truffle.js:** Truffle configuration file


To begin, create a new contract called `Hello.sol` under the `contracts/` folder. Copy and paste the code below (this is the same contract we used in the Hello Blockchain tutorial):

```solidity
	pragma solidity ^0.4.13;

	contract Hello {
	  //this will hold our greeting text
	  string greeting;

	  function Hello() public {
	    //constructor to initialize default greeting to hello
	    greeting = "hello";
	  }

	  function getGreeting() public view returns (string) {
	    //return the greeting
	    return greeting;
	  }

	  function setGreeting(string _greeting) public {
	    //set the greeting to user-provided input
	    greeting = _greeting;
	  }
	}
```

We'll use a migration to deploy `Hello.sol` to the blockchain. To do this, we need to create a new file under the `migrations/` folder.

You'll notice there is already a migration called `1_initial_migration.js` here. This deploys `Migrations.sol` to the blockchain. With Truffle, migrations run in sequential order based on the number in the file path.

Write the following code in `2_deploy_contracts.js` to deploy `Hello.sol`:

```node
var Hello = artifacts.require("./Hello.sol");

module.exports = function(deployer) {
	deployer.deploy(Hello);
};
```

When we run the migrate command in our truffle console, it will initiate the execution of the migrations, which will deploy our contracts to the blockchain.

```terminal
truffle develop
```

In a new terminal window, open the same `helloTruffle` folder you have your contract in, and run the following to open truffle logs:

```terminal
truffle develop --log
```

That window will now display the output of the activity on the chain. Back in your truffle develop console, run the migrate command to migrate the contract to the chain. Because we are already in the truffle develop console, we can run migrate without the "truffle" command. Keep in mind you can also call truffle migrate from outside the develop mode, we have chosen to do it this way to illustrate how truffle's develop mode lets us interact with the contracts in an easier way.

```node
migrate
```

Now our `Hello.sol` contract should have been migrated to the blockchain. Your output should look something like:

```node
	Running migration: 1_initial_migration.js
	  Replacing Migrations...
	  ... 0x4e914e28978087d8d275ffd7fba246a2123f165ac2913e0c8bfd8e1cfb19ff2c
	  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
	Saving successful migration to network...
	  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
	Saving artifacts...
	Running migration: 2_deploy_contracts.js
	  Replacing Hello...
	  ... 0xbf8d2bdfe4252bb739e50efda947d991db0afa65e29f5eb9fd23052a4963a715
	  Hello: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
	Saving successful migration to network...
	  ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
	Saving artifacts...
```

and if you look at the terminal running your logs you'll see the blockchain transactions running.

Now, we can interact with it directly to get its address:

```node
Hello.address
```

You should see a `'0x....'` address returned. This is the address of our contract on the chain. Now any player in the network can call the contract by addressing it directly.

If you run the following command you will also see the addresses of the 10 test accounts that truffle has created for us:

```node
web3.eth.accounts
```

Notice that it returns an array of addresses, these are the default truffle test addresses, and we can use any of them to invoke the contract. We used web3 to access them.

Now, we will call the methods on our contract. We will first begin by creating an instance of the contract. When we did this without Truffle, we had to do all the intermediate steps of compiling and extracting the executable code. Truffle and web3 take care of that for us here and store an instance of our smart contract in an object called app.

```node
Hello.deployed().then(function(instance){ app=instance; })
```

The Truffle environment may not be kind to breaking the code above across multiple lines.

The objective of the callback above was to capture the `instance` of the application created when calling the `deployed()` method.  To verify that it worked, check the contents of the `app` object, which you should recognize from past exercises:

```node
app
```

Now we can call the methods directly off of app:

```node
app.getGreeting()
```

should return the default greeting set in your contract, and:

```node
app.setGreeting("Your greeting here", {from:web3.eth.accounts[0]})
```

should return a transaction receipt like this:

```node
	{ tx: '0x2a19e5bd16bb4d82b0528f6eb8867ae7a90fe9d8bc45e68b5f3adafa191ea6f0',
	  receipt:
	   { transactionHash: '0x2a19e5bd16bb4d82b0528f6eb8867ae7a90fe9d8bc45e68b5f3adafa191ea6f0',
	     transactionIndex: 0,
	     blockHash: '0x47fb2ae21901b155905848aabc6c6424436d27231f6b79234519e933f0d68524',
	     blockNumber: 5,
	     gasUsed: 33864,
	     cumulativeGasUsed: 33864,
	     contractAddress: null,
	     logs: [],
	     status: '0x01' },
	  logs: [] }
```

Now get the greeting again and verify that it did indeed change:

```node
	app.getGreeting()
```

If you look at the output in the log window, you can see the history of all the calls you made to the contract and any blocks you may have added. Truffle also shows you the transaction IDs of the transactions that have been processed. This gives us a good amount of information about what's happening on our chain. In the next lab, we will use the Ganache GUI to get an even better, more navigable look at our chain activity.

To exit the truffle console, run:

```node
.exit
```
