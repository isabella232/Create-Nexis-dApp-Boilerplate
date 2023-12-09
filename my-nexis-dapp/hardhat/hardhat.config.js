require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    exzo: {
      url: "https://evm-test.exzo.network", 
      accounts: ["f2b08f0c3bfcfe25c5ce58c3c353ecfaf751a34465daa6191bfe52f8958a80ac"], 
      gasPrice: 2000000000, 
    },
  }
};
