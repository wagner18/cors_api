'use strict';
/*
* Cors blockchain middleware
* Author: Wagner Borba
* version: 0.0.1
*/

var _ = require('lodash');
var models = require('./models');
var Account = require('./bitcoin/account');
var BitcoinTransaction = require('./bitcoin/transaction');


var network = 'testnet';

// Return a instance of pubkeyBox model
export const setPubkeyBox = () => {
	let pubkeyBox = new models.PubkeyBox();
	return pubkeyBox;
}

// Return a instance of Basic Transaction Model
export const setBasicTxModel = () => {
	let txData = new models.BasicTxModel();
	return txData;
}

// Return a instance of Multisig Transaction Model
export const setMultisigTxModel = () => {
	let txData = new models.MultisigTxModel();
	return txData;
}

//Account interface

/*
* Create a new blockchain account
* @return account - A blockchain account object
*/
export const newBasicAccountBitcoin = (accountName) => newAccount({platform: 'bitcoin', type: 'basic'}, accountName);
export const newMultisigAccountBitcoin = (accountName) => newAccount({platform: 'bitcoin', type: 'starndardMultisig'}, accountName);


/*
*
*/
export const getAccountBalanceBitcoin = (accountName) => getAccountBalance({platform: 'bitcoin'}, accountName);


//Transaction interface

/*
* Define a 3 of 4 escrow address which will be used on single corsbay transaction
* @param pubkeyBox - An instance of pubkeyBox with the 4 public keys in the fiven order
* THE ORDER OF PUBLICK KEYS MUST BE KEPT ( the private keys for unlock the escrow account must be given in the same order)
* escrow pubkey 1
* escrow pubkey 2
* seller pubkey
* buyer pubkey
*/
export const newEscrowTxAccountBitcoin = (accountName, threshold, pubkeyBox) => newEscrowAccount({platform: 'bitcoin', type: 'escrowMultisig'}, accountName, threshold, pubkeyBox);

/*
* Get transaction from the blockchain
* @param txid - The transaction hash ID.
* @return - Promise with the transaction details.
*/
export const getTransactionBitcoin = (txid) => getTransaction({ platform: 'bitcoin'}, txid);


/*
* Transaction builder interface
* @param txData - The data to build the transaction.
* @return - Promise with the raw transaction as a return
*/
export const buildTransactionBitcoin = (txData) => buildTransaction({ platform: 'bitcoin' }, txData);

/*
* Sing the given transaction.
* @param tx - Transaction the be signed.
* @param data - The data to sign the transaction. {from, uRawtx, privatekeys, redeemScript}
* @return a signed transaction.
*/
export const singTransactionBitcoin = (tx, privateKeys) => signTransaction({platform: 'bitcoin',}, tx, privateKeys);

/*
* Broadcast the transaction to the network.
* @param rawTx - The raw transaction to be broadcasted.
* @return The transaction hash ID.
*/
export const broadcastTransactionBitcoin = (rawTx) => broadcastTransaction({platform: 'bitcoin'}, rawTx);






/*
* Create a new blockchain account based on the platform defined [bitcoin, ethereum, litecoin]
* @param args - Define the platform and type of account to be created
* @param accountName - The name of the new account
* @return - A Promise with the raw account
*/
function newAccount(args, accountName){

	if(args.platform == undefined || args.type == undefined)	{
		let msg = 'Error: Account creation - Invalid paramaters';
		throw new Error(msg);
	}

	// Bitcoin layer
	if(args.platform == 'bitcoin'){

		let account = null;
		if(args.type == 'basic'){

			return Account.newSeedAccount(accountName).then((account) => {

        console.log("Bitcoin Basic Account created.");

        let accountObj = new models.AccountModel();
        accountObj.walletAccount = account.account;
        accountObj.address = account.internalAddress;
        accountObj.keys.push({ pubkey: account.pubkey, privkey: account.privkey });
        accountObj.type =  args.type;
        accountObj.platform = args.platform;
        accountObj.createdAt = Date.now();

        return (accountObj instanceof models.AccountModel) ? accountObj : null;

      })
      .catch((error) => {
        console.log(error);
      });

		}
		else if(args.type == 'starndardMultisig'){

      return Account.newStandardMultisigAccount(accountName, network).then((account) => {

        console.log("Bitcoin Multisig Account created.");

        let accountObj = new models.AccountModel();
        accountObj.walletAccount = account.multisigAccount.account;
        accountObj.address = account.multisigAccount.multisigAddress;

        accountObj.keys.push(account.internalAddress);
        accountObj.keys.push(account.externalAddress1);
        accountObj.keys.push(account.externalAddress2);

        accountObj.scriptPubKey = account.multisigAccount.scriptPubKey;
        accountObj.redeemScript = account.multisigAccount.redeemScriptHex;
        accountObj.threshold = account.multisigAccount.threshold;
        accountObj.type =  args.type;
        accountObj.platform = args.platform;
        accountObj.createdAt = Date.now();

        return (accountObj instanceof models.AccountModel) ? accountObj : null;

      })
      .catch((error) => {
        console.log(error);
      });

		}

	}
	// TODO: Ethereum layer
	else if(args.platform == 'ethereum'){
		// ethereum web3 library
		console.log('Ethereum account to be created');
	}
	// TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
  	console.log('Litecoine account to be created');
	}

}


/*
* Create a new escrow account based on the platform defined [bitcoin, ethereum, litecoin]
* @param args - Define the platform and type of account to be created
* @param accountName - The name of the new escrow account
* @param threshold - The number of signature required to unlock the funds
* @param pubkeys - The set of public keys that own the account
* @return - A Promise with the raw account
*/
function newEscrowAccount(args, accountName, threshold, pubkeyBox){

	if(args.platform == undefined)	{
		let msg = 'Error: Escrow Account creation - Invalid paramaters.';
		throw new Error(msg);
	}

	// Bitcoin layer
	if(args.platform == 'bitcoin'){

    let pubkeys = [];
    _.forEach(pubkeyBox, (pkey) => {
      pubkeys.push(pkey);
    });

    return Account.newEscrowAccount(accountName, threshold, pubkeys).then((account) => {

      console.log("Bitcoin Escrow Account.");

      let accountObj = new models.AccountModel();
      accountObj.walletAccount = account.account;
      accountObj.address = account.multisigAddress;
      accountObj.keys = account.pubkeys;
      accountObj.scriptPubKey = account.scriptPubKey;
      accountObj.redeemScript = account.redeemScriptHex;
      accountObj.threshold = account.threshold;
      accountObj.type =  args.type;
      accountObj.platform = args.platform;
      accountObj.createdAt = Date.now();

      return (accountObj instanceof models.AccountModel) ? accountObj : null;

    })
    .catch((error) => {
      console.log(error);
    });


	}
	// TODO: Ethereum layer
	else if(args.platform == 'ethereum'){
		// ethereum web3 library
		console.log('Ethereum account to be created');
	}
	// TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
  	console.log('Litecoine account to be created');
	}

}


// Transactions


/*
* Build a new unsigned transaction
* @param args - Set the platform (use a object for future functionalities)
* @param from - The address which the unspent transaction belong to.
* @param to - The recipient address which the funds will be sent to.
* @param change - The address which the change funds will be returned to.
* @param amount - The amount to be spent.
* @param fee - The fee in satoshis that the sender wants to pay. If omitted will use the default value.
* @return - Return a Promise with the result of the unsigned raw transaction.
*/
function buildTransaction(args, {from: from_addr, to: to_addr, change: chg_addr, amount: value, fee: txFee}){

	if(args.platform == undefined)	{
		let msg = 'Error: Build transaction - Invalid paramaters.';
		throw new Error(msg);
	}

	if(args.platform == 'bitcoin'){

    return BitcoinTransaction.newTransaction({
      from: from_addr,
      to: to_addr,
      change: chg_addr,
      amount: value,
      fee: txFee,
    }).then((uRawTx) => {
      console.log("New Transaction...\n" + uRawTx);
      return uRawTx;
    })
    .catch((error) => {
      console.log(error);
    });

	}
	// TODO: Ethereum layer
	else if(args.platform == 'ethereum'){
		// ethereum web3 library
		console.log('Ethereum account to be created');
	}
	// TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
  	console.log('Litecoin account to be created');
	}


}

/*
* Sign a transaction interile or partially
* @param args - Set the platform (use a object for future functionalities)
* @param from - The address which the unspent transaction belong to.
* @param rawTx - The raw transaction to signed.
* @param privkeys - An array with one or more private keys that will sign the given tx.
* @param redeemScript - If the address is a P2SH the redeemScript is required in order to sign the tx, if not it can be omitted.
* @return - Return a Promise with the result of the signed transaction
*/
function signTransaction(args, {from: addr, uRawtx: tx, privatekeys: privkeys, redeemScript: redeem = false}){

	if(args.platform == undefined)	{
		let msg = 'Error: sign transaction - Invalid paramaters.';
		throw new Error(msg);
	}

	if(args.platform == "bitcoin"){

    let data = {
      from: addr,
      rawTx: tx,
      privkeys: privkeys,
      redeemScript: redeem
    };

    return BitcoinTransaction.signTransaction(data).then((signedRawTx) => {
      console.log("Signed Raw  Transaction...");
      return signedRawTx;
    })
    .catch((error) => {
      console.error(error);
    });


	}
	// TODO: Ethereum layer
	else if(args.platform == 'ethereum'){
		// ethereum web3 library
		console.log('Ethereum');
	}
	// TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
  	console.log('Litecoin');
	}
}


/*
* Broadcast a transaction
* @param args - Set the platform (use a object for future functionalities)
* @param rawtx - The raw transaction to be signed
* @return - Return a Promise with the broadcasted transaction id
*/
function broadcastTransaction(args, rawtx){

	if(args.platform == undefined || !rawtx)	{
		let msg = 'Error: broadcast transaction - Invalid paramaters.';
		throw new Error(msg);
	}

	if(args.platform == 'bitcoin'){

    broadcastTransaction({signedRawTx: rawtx}).then((txId) => {
      console.log("Transaction successfully broadcasted!\n", txId);
      return txId;
    })
    .catch((error) => {
      console.log(error);
    });

	}
	// TODO: Ethereum layer
	else if(args.platform == 'ethereum'){
		// ethereum web3 library
		console.log('Ethereum');
	}
	// TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
  	console.log('Litecoin');
	}
}



/*
* @param args
* @param account - The account which the balance will be retrieved
* @return - A Promise with the account balance
*/
function getAccountBalance(args, account){

  if(args.platform == undefined || !account) {
    let msg = 'Error: Account balance - Invalid paramaters.';
    throw new Error(msg);
  }

  if(args.platform == "bitcoin"){
    return Account.getAccountBalance(account);
  }
  // TODO: Ethereum layer
  else if(args.platform == 'ethereum'){
    // ethereum web3 library
    console.log('Ethereum');
  }
  // TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
    console.log('Litecoin');
  }
}


/*
*
*/
function getTransaction(args, txid){
  if(args.platform == undefined) {
    let msg = 'Error: Getting Transaction - Invalid paramaters.';
    throw new Error(msg);
  }

  if(args.platform == "bitcoin"){

    return Transaction.getTransaction({txid: txid }).then((tx) =>{
      return tx;
    })
    .catch((error) => {
      console.log(error);
    });

  }
  // TODO: Ethereum layer
  else if(args.platform == 'ethereum'){
    // ethereum web3 library
    console.log('Ethereum');
  }
  // TODO: Litecoin Layer
  else if(args.platform == 'litecoin'){
    console.log('Litecoin');
  }
}



