import React, { useEffect, useState } from "react";
import CryptoCoders from "./contracts/CryptoCoders.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [mintText, setMintText] = useState("");
  const [coders, setCoders] = useState([]);

  //load all the NFTS
  const loadNFTS = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    let nfts = [];

    for (let i = 0; i < totalSupply; i++) {
      let coder = await contract.methods.coders(i).call();
      nfts.push(coder);
    }
    setCoders(nfts);
  };

  //Load the contract
  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();

    const networkData = CryptoCoders.networks[networkId];

    if (networkData) {
      const abi = CryptoCoders.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      return contract;
    }
  };

  //Load web3 account from Metamask
  const loadWeb3Account = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      setAccount(accounts[0]);
    }
  };

  const getAll = async () => {
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    let contract = await loadWeb3Contract(web3);
    await loadNFTS(contract);
  };

  useEffect(() => {
    getAll();
  }, []);

  const mint = () => {
    console.log(mintText);
    contract.methods.mint(mintText).send({ from: account }, (error) => {
      console.log("Worked");
      if (!error) {
        setCoders([...coders, mintText]);
        setMintText("");
      }
    });
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Crypto Coders
          </a>
          <span className="text-white">{account}</span>
        </div>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              src="https://avatars.dicebear.com/api/adventurer/Alberto.svg"
              alt=""
              className="mb-4"
              width="72"
            />
            <h1 className="fw-bold display-5">Crypto Coders</h1>
            <div className="col-6 text-center">
              <p className="lead text-center">
                These are some of the most highly motivated coders in the world!
                We are here to learn coding and apply it to the betterment of
                humanity. We are inventors, innovators, and creators.
              </p>
              <div className="">
                <input
                  type="text"
                  placeholder="e.g. Alberto"
                  className="form-control mb-2"
                  value={mintText}
                  onChange={(e) => setMintText(e.target.value)}
                />
                <button onClick={mint} className="btn btn-primary">
                  Mint
                </button>
              </div>
            </div>
            <div className="col-8 d-flex justify-content-center flex-wrap">
              {coders.map((coder, key) => (
                <div
                  key={key}
                  className="d-flex flex-column align-items-center"
                >
                  <img
                    src={`https://avatars.dicebear.com/api/adventurer/${coder}.svg`}
                    width="150"
                  />
                  <span>{coder}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
