'use strict';
/*
* Create an account with bitcoin
* Author: Wagner Borba
* version: 0.0.1
*/

var _ = require('lodash');
var bitcoinClient = require('./bitcoinCli');
var Address = require('./address');

/*
* Create a new basic account with seed public key to the standard multisig address
* @param account - The account name identifier [User UID]
* @return - Return a Promise with the account's data
*/
const newSeedAccount = (account) => {

  if(!_.isString(account) || account.length < 16) {
    let errorMsg = "\nError: Basic Account - Bad data inputed. check your parameters";
    throw new Error(errorMsg);
  }

  return Address.newInternalAddress(account).then((intAccount) => {
    return intAccount;
  });

}


/*
* Create a new standard multisig address and add it to the given account
* @param account - The account name identifier [User UID]
* @param network - The network of the account
* @return - Return a Promise with the account's data
*/
const newStandardMultisigAccount = (account, network) => {

  if(!_.isString(account) || account.length < 16) {
    let errorMsg = "\nError: Basic Account - Bad data inputed. check your parameters";
    throw new Error(errorMsg);
  }

  return new Promise((resolve, reject) => {

    // set first external key pair
    let extAddress1 = Address.newExternalAddress(network);
    let extAddress2 = Address.newExternalAddress(network);

    // Set a new account with a internal address
    Address.newInternalAddress(account).then((intAddress) => {

      let keys = [
        intAddress.pubkey,
        extAddress1.pubkey,
        extAddress2.pubkey
      ]

      Address.newMultisigAddress(2, keys, account).then((mIntAddress) => {
        resolve({
          multisigAccount: mIntAddress,
          internalAddress: intAddress,
          externalAddress1: extAddress1,
          externalAddress2: extAddress2
        });
      })
      .catch((error) => {
        reject(error);
      });

    });

  });

}


/*
* TODO!!!
*/
const setStandardMultisigAccount = () => {

}


/*
* Create a new escrow multisig address and add it to the given account
* @param account - The account name identifier [User UID]
* @param threshold - The number of required signature to unlock
* @param pubkeys - An array of public key which will own the escrow address
* @return - Return a Promise with the account's data
*/
const newEscrowAccount = (account, threshold, pubkeys) => {

  if(!_.isString(account) || account.length < 16 || !_.isArray(pubkeys) || pubkeys.length < threshold) {
    let errorMsg = "\nError: Escrow Account - Bad data inputed. check your parameters";
    throw new Error(errorMsg);
  }

  return new Promise((resolve, reject) => {
      Address.newMultisigAddress(threshold, pubkeys, account).then((mEscrowAddress) => {
        resolve(mEscrowAddress);
      })
      .catch((error) => {
        reject(error);
      });

  });

}


/*
* Get the balance of a given account
* @param account - The account name identifier [User UID]
* @param confirmation - The minimal number of transaction confirmations
* @param watchonly - Define if will return only watchonly address balance.
* @return - Return a Promise with the account balance.
*/
const getAccountBalance = ({account: acct, confirmation: conf = 6, watchonly: wonly = true}) => {

  return new Promise((resolve, reject) => {

    let client = bitcoinClient();
    client.getBalance(acct, conf, wonly, (err, balance) => {
      if(err){
        reject(err);
      }else{
        resolve(balance);
      }
    });
  });

}


const Account = {
  newSeedAccount: newSeedAccount,
  newStandardMultisigAccount: newStandardMultisigAccount,
  newEscrowAccount: newEscrowAccount,
  getAccountBalance: getAccountBalance
}

module.exports = Account;

