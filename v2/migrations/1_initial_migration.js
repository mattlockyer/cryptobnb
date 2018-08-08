

const Migrations = artifacts.require("./Migrations.sol");
const Property = artifacts.require("./Property.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Property, 'Property', 'PROP');
};
