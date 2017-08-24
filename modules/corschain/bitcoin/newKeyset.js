'use strict';
/*
* Create simple P2PKH bitcoin address
* Author: Wagner Borba
* version: 0.0.1
*/

var bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');

/*
*
*/
const newKeyset = (network, mnemonic = "random") => {

  if(network == "testnet"){
    network = { network: bitcoin.networks.testnet };
  }
  else if(network == 'litecoin'){
    network = { network: bitcoin.networks.litecoin };
  }else{
    network = undefined;
  }

  let keyPair = {};
  // Generager a key rendomicly
  if(mnemonic == "random"){
    keyPair = bitcoin.ECPair.makeRandom(network);
  }
  // generate from a specific hash
  else {
    if(mnemonic.lenght < 32) {
      let errorMsg = "\nKey pairs: Mnemonic to small, please provide on more secure.";
      throw new Error(errorMsg);
    }

    let hash = bitcoin.crypto.sha256(mnemonic);
    let d = BigInteger.fromBuffer(hash);
    keyPair = new bitcoin.ECPair(d, null, network);
  }

  let privateKeyWIF = keyPair.toWIF();
  let publicKey =  keyPair.getPublicKeyBuffer().toString('hex');
  let address = keyPair.getAddress();

  return {
    privateKeyWIF: privateKeyWIF, // Wallet Import Format Private key (base58 with checksum)
    publicKeyHex: publicKey, // DEM Hex string format
    address: address
  }

}


module.exports = newKeyset;
