

const Migrations = artifacts.require("./Migrations.sol");
const Property = artifacts.require("./Property.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Property, 'Property', 'PROP').then(() =>
    deployer.deploy(PropertyRegistry, Property.address)
  );
};
