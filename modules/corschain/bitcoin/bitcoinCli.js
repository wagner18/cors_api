'use strict';
/*
* Cors blockchain bitcoin client
* Author: Wagner Borba
* version: 0.0.1
*/

var bitcoin = require('bitcoin');

const bitcoinClient = (ext = false) => {

  if(!ext){
    return new bitcoin.Client({
      host: 'localhost',
      port:  18332, //testnet por 18332 mainnet 8332
      user: 'testbitcoin',
      pass: '123098',
      timeout: 30000
    });
  }else{
    // external text client
    return new bitcoin.Client({
      host: 'rpc.blockchain.info',
      port:  433,
      user: '53a3e3d7-d4ad-4726-8046-14df3b5ddcc7',
      pass: 'wallet589806',
      ssl: true,
      timeout: 30000,
    });
  }
}



// default port //8332,
// ./bitcoind -datadir=/Volumes/wagner/bitcoin

module.exports = bitcoinClient;
