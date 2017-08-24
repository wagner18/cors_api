'use strict';
/*
* Handle bitcoin addresses
* Author: Wagner Borba
* version: 0.0.1
*/

var _ = require('lodash');
var bitcoin = require('bitcoinjs-lib');
var bitcoinClient = require('./bitcoinCli');
var newKeyset = require('./newKeyset');


/*
* Create single address - Can be used to seed a multisig user address (recoverable)
* @param account - The account to associate the new address.
* @return - Return a Promise with a object with the new address, key pairs dump and account name - BE CAREFUL!
*/
const newInternalAddress = (account = "") => {

  return new Promise((resolve,reject) => {

    let client = bitcoinClient();
    client.getNewAddress(account, (err, address) => {

      if(err) {
        console.log(err);
        reject(err);
      }

      client.dumpPrivKey(address, (err, pkv) => {
        if(err) {
          console.log(err);
          reject(err);
        }

        // Check validity of the new P2PKH address
        client.validateAddress(address, (err, validData) => {

          if(!validData && !validData.isvalid){
            let errorMsg = "\nError: new Internal Address - invalid address. Run again to find a new EC point";
            reject(errorMsg);
          }else{
            resolve({
              account: account,
              internalAddress: address,
              privkey: pkv,
              pubkey: validData.pubkey
            });
          }

        });

      });

    });

  });

}


/*
* Set a new random multisig address with a arbitrary threshold and key number.
* @param threshold - The number of signature requeired to unlock the address.
* @param keysNum - The number of address the will compose the multising address.
* @param account - The account to associate the new address.
* @return - Return a Promise with a object with the new multisig address and all the address and data associated with it.
*/
const newInternalMultisigAddress = (threshold = 1, keysNum, account = "") => {

  if(!_.isNumber(threshold) || !_.isNumber(keysNum) || threshold > keysNum) {
    let errorMsg = "\nError: Multisig Address - Bad data inputed. check your parameters";
    throw new Error(errorMsg);
  }

  let keys = [];
  _.times(keysNum, () => {
    keys.push(newInternalAddress());
  });

  return Promise.all(keys).then(addresses => {

    let client = bitcoinClient();
    client.addMultiSigAddress(threshold, addresses.map((addr) => addr.internalAddress), account, (err, address) => {

      if(err){
        reject(err);
      }

      client.validateAddress(address, (err, validData) => {

        if(!validData && !validData.isvalid){
          let errorMsg = "\nError: new Escrow Address - invalid address. Run again to find a new EC point";
          reject(errorMsg);
        }else{
          resolve({
            account: account,
            internalMultisigAddress: address,
            members: addresses,
            threshold: threshold,
            scriptPubKey: validData.scriptPubKey,
            redeemScriptHex: validData.hex
          });
        }

      });

    });

  });

}


/* 
* Set a new multisig address with the given public keys or address and  a defined threshold.
* @param threshold - The number of signature requeired to unlock the address.
* @param pubkeys - The public keys or addresses the will compose the multising address.
* @param account - The account to associate the new address.
* @return - Return a Promise with a object with the new multisig address, redeemScript and all the address associated with it.
*/
const newMultisigAddress = (threshold, pubkeys, account = "") => {

  if(!_.isNumber(threshold) || !_.isArray(pubkeys) || threshold > pubkeys.length) {
    let errorMsg = "\nError: Multisig Address - Bad data inputed. check your parameters";
    throw new Error(errorMsg);
  }

  return new Promise((resolve, reject) => {

    let client = bitcoinClient();
    client.addMultiSigAddress(threshold, pubkeys, account, (err, address) => {

      if(err){
        reject(err);
      }

      client.validateAddress(address, (err, validData) => {

        if(!validData || !validData.isvalid){
          let errorMsg = "\nError: new Multisig Address - invalid public key found";
          reject(errorMsg);
        }else{

          // inport the new multisig address to the corsbay wallet as a watch only
          client.importAddress(address, account, false, (err) => {
            if(err) console.log("Address "+ address + " could not be imported. \n ", err.message);
          });

          resolve({
            account: account,
            multisigAddress: address,
            pubkeys: pubkeys,
            threshold: threshold,
            scriptPubKey: validData.scriptPubKey,
            redeemScriptHex: validData.hex
          });
        }

      });

    });

  });

}


/*
* Generate a P2PKH bitcoin addres address
* @param network - The network which the new address will belong to.
* @return - REturn a object with the new address, privkey in WIF and hex public key.
*/
const newExternalAddress = (network) => {

  let keyset = newKeyset(network); // generate a new pair of keys (secp256k1)

  return {
    externalAddress: keyset.address,
    privkey: keyset.privateKeyWIF,
    pubkey: keyset.publicKeyHex
  }

}


/*
* Import the new address to the corsbay wallet as a watch only address
* @param address - The address to be imported
* @param account - The account to associate the new address.
* @param rescan - If set true will rescan the blockchain for transaction associated with the imported address.
* @return - True if successful and false if not.
*/
const importAddress = ({address: addr, account: acct, rescan: rscan = false}) => {
  let client = bitcoinClient();

  // You want to validade this data man!!!!!!
  client.importAddress(addr, acct, rscan, (err) => {
    if(err) {
      console.log("Address "+ address + " could not be imported. \n ", err.message);
      return false;
    }else{
      console.log('The new address was imported as a watch only address');
      return true;
    }
  });

}


const Address = {
  newInternalAddress: newInternalAddress,
  // newInternalMultisigAddress: newInternalMultisigAddress, NOT READY
  newMultisigAddress: newMultisigAddress,
  newExternalAddress: newExternalAddress
};

module.exports = Address;



