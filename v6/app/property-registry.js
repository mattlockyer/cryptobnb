//jshint ignore: start

const PropertyRegistry = {
  
  config: {
    host: 'http://127.0.0.1:9545/', //truffle develop provider
    contractAddress: null, //will be automatically discovered by trufflecontract.js
  },
  contractName: 'PropertyRegistry',
  path: '../build/contracts/',
  contract: null,
  currentUser: null,
  block: null,
  /**************************************
  * initializing the contract
  **************************************/
  async init() {
    console.log(this.contractName + ' initialized');
    utils.getWeb3(this.config.host);
    this.block = 0;
    //this.block = web3.eth.blockNumber(console.log);
    web3.eth.getAccounts((err, accounts) => {
      this.currentUser = accounts[0];
    });
    const json = await fetch(this.path + this.contractName + '.json').then((res) => res.json());
    this.contract = await utils.getContract(json, this.config.contractAddress);
    this.setEventListeners();
  },
  /**************************************
  * event listeners
  **************************************/
  setEventListeners() {
    const { contract, block } = this;
    const event = contract.allEvents({ fromBlock: block, toBlock: 'latest' });
    event.watch((err, res) => {
      if (err) console.log('watch error', err);
      if (this[res.event] && typeof this[res.event] === 'function') this[res.event](res);
    });
  },
  //events
  async Talk({ args }) {
    App.updateData(args._message);
  }
};