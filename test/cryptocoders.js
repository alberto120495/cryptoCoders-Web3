const CryptoCoders = artifacts.require("./CryptoCoders.sol");

contract("CryptoCoders", (accounts) => {
  let contract;
  before(async () => {
    contract = await CryptoCoders.deployed();
  });

  it("...Get deployed", async () => {
    assert.notEqual(contract, "");
  });

  it("...get's minted and added", async () => {
    const result = await contract.mint("Albert");
    let coder = await contract.coders(0);
    assert(coder, "Albert");
  });
});
