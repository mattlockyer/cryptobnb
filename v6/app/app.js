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
    //creating property
    qs('#create-property-alice').onclick = async () => {
      try {
        const tx = await Property.contract.createProperty({
          from: this.alice
        });
      } catch(e) {
        alert('Error creating property', e)
      }
    }
  },
  
  async updateData(msg) {
    // qs('#msg').innerHTML = msg ? msg : await Property.contract.message.call();
    // qs('#price').innerHTML = toEth(await Property.contract.price.call());
    // if (this.users.length === 1) {
    //   qs('#owner').innerHTML = await Property.contract.owner.call();
    // } else {
    //   qs('#owner').innerHTML = (await Property.contract.owner.call() == this.alice ? 'Alice' : 'Bob');
    // }
    // //balances
    // this.users.forEach(async (name) => {
    //   web3.eth.getBalance(this[name], (err, res) => qs('#balance-' + name).innerHTML = toEth(res));
    // })
  }
  
};