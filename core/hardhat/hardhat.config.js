/**
 * @file Hardhat configuration file for Nexis dApp Boilerplate.
 * @module hardhat.config
 */

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  /**
   * Solidity compiler version.
   * @type {string}
   */
  solidity: "0.8.9",
  networks:{
    /**
     * Nexis network configuration.
     * @type {Object}
     */
    nexis: {
      /**
       * URL of the Nexis network.
       * @type {string}
       */
      url: "https://evm-test.nexis.network", 
      /**
       * Array of account private keys.
       * @type {string[]}
       */
      accounts: ["f2b08f0c3bfcfe25c5ce58c3c353ecfaf751a34465daa6191bfe52f8958a80ac"], 
      /**
       * Gas price for transactions on the Nexis network.
       * @type {number}
       */
      gasPrice: 2000000000, 
    },
  }
};
