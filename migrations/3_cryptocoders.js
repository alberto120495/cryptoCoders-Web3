var CryptoCoders = artifacts.require("./cryptocoders.sol");

module.exports = function (deployer) {
  deployer.deploy(CryptoCoders);
};
