//jshint ignore: start

const qs = (sel) => document.querySelector(sel);
const toEth = (bn) => Math.round(web3.fromWei(bn) * 10000, 4) / 10000;
const toWei = (eth) => web3.toWei(eth, 'ether');

window.onload = () => App.init();


const App = {
  
  alice:null,
  bob:null,
  
  async init() {
    await Property.init(); //wait until the property is initialized
    await PropertyToken.init(); //wait until the property token is initialized
    await PropertyRegistry.init(); //wait until the property registry is initialized
    
    const { accounts } = web3.eth;
    //console.log(accounts);
    
    this.users = ['alice'];
    this.alice = accounts[0];
    
    if (accounts.length === 1) {
      qs('#bob').style.display = 'none';
    } else {
      this.users.push('bob');
      this.bob = accounts[1];
    }
    
    this.updateData();
    this.setEventListeners();
  },
  
  setEventListeners() {
    const { alice, bob } = this;
    //creating property
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
  },
  
  async updateData(msg) {
    const { alice, bob } = this;
    /**************************************
    * Reads
    * potentially break these up into serparate functions
    * only when transactions / events affect these functions should we read again
    **************************************/
    //property token balances
    qs('#balance-alice').innerHTML = await PropertyToken.contract.balanceOf.call(alice);
    qs('#balance-bob').innerHTML = await PropertyToken.contract.balanceOf.call(bob);
    //properties owned
    const aliceProperties = await Property.contract.getProperties.call({ from: alice });
    qs('#properties-alice').innerHTML = aliceProperties.length ? aliceProperties : 'no properties';
    const bobProperties = await Property.contract.getProperties.call({ from: bob });
    qs('#properties-bob').innerHTML = bobProperties.length ? bobProperties : 'no properties';
    
  }
  
};