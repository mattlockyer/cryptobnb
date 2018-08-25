

//jshint ignore:start

const utils = {
  /**************************************
   * helpers
   **************************************/
  async getWeb3(host) {
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
  },
  
  async getContract(json, address, web3 = window.web3) {
    const contract = TruffleContract(json);
    contract.setProvider(web3.currentProvider);
    return address ? contract.at(address) : contract.deployed();
  }

}