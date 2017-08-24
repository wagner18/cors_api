'use strict';
/*
* Handle transactions
* Author: Wagner Borba
* version: 0.0.1
*/

var _ = require('lodash');
var bitcoin = require('bitcoinjs-lib');
var bitcoinClient = require('./bitcoinCli');

const BITCOIN_REQ_CONF = 6;

/*
* Build a new transaction
* @param from - The address which the unspent transaction belong to.
* @param to - The recipient address which the funds will be sent to.
* @param change - The address which the change funds will be returned to.
* @param amount - The amount to be spent.
* @param fee - The fee in satoshis that the sender wants to pay. If omitted will use the default value.
* @return - Return a Promise with the result of the unsigned raw transaction.
*/
const newTransaction = ({from: from_addr, to: to_addr, change: chg_addr, amount: value, fee: txFee = 5400}) => {

  var network = bitcoin.networks.testnet;
  var satoshiFactor = 1e8;

  return new Promise((resolve, reject) => {

    let client = bitcoinClient();
    client.listUnspent(BITCOIN_REQ_CONF, 1e7,[from_addr], (err, utxouts) => {

      if(err){
        console.log(err);
        reject(err);
      }else{

        let txb = new bitcoin.TransactionBuilder(network, txFee);

        // console.log("\nUnsend Transactions: ", utxouts);
        let totalAmount = 0;
        _.forEach(utxouts, (txout, i) => {

          txb.addInput(txout.txid, txout.vout);
          totalAmount += txout.amount;
        });

        //convert total output amount to Satoshis
        let totalAmountSatoshis = Math.round(totalAmount * satoshiFactor);
        // add Change address output
        let changeValue = (totalAmountSatoshis - (value + txFee));


        console.log(totalAmount, totalAmountSatoshis, changeValue);

        // Validate Address total unspent output balance
        if(changeValue < 0) {
          let errorMsg = "\nAction Canceled: Balance insufficient to complete the operation. \nCurrent balance: " + totalAmount;
          throw new TypeError(errorMsg);
        }

        // add TO address output and the amount to be sent
        txb.addOutput(to_addr, value); //Amount in satoshis!!!
        // Add Change address and the amount to be sent
        txb.addOutput(chg_addr, changeValue);

        let unsignedTx = txb.buildIncomplete().toHex();

        // txb.sign(0, keyPairs[2], redeemScript);
        resolve(unsignedTx);
      }
    });

  });

}


/*
* Broadcast a transaction to the network
* @param tx - Raw signed transaction to be validated and broadcasted
* @return - Return a Promise with the result of the transaction broadcast
*/
const broadcastTransaction = ({signedRawTx: tx}) => {

  return new Promise((resolve, reject) => {
    let client = bitcoinClient();
    client.sendRawTransaction(tx, false, (err, txId) => {
      if(err){
        reject(err);
      }else{
        resolve(txId);
      }
    });

  });

}



/*
* Sign a transaction interile or partially
* @param from - The address which the unspent transaction belong to.
* @param rawTx - The raw transaction to signed.
* @param privkeys - An array with one or more private keys that will sign the given tx.
* @param redeemScript - If the address is a P2SH the redeemScript is required in order to sign the tx, if not it can be omitted.
* @return - Return a Promise with the result of the signed transaction
*/
const signTransaction = ({from: from_addr, rawTx: tx, privkeys: pkeys, redeemScript: redeem = false}) => {

  var network = bitcoin.networks.testnet;

  return new Promise((resolve, reject) => {

    let client = bitcoinClient();
    client.listUnspent(6, 1e7,[from_addr], (err, utxouts) => {

      let outputs = [];
      _.forEach(utxouts, (utxout) => {
          let out = {
            txid: utxout.txid,
            vout: utxout.vout,
            scriptPubKey: utxout.scriptPubKey,
            amount: utxout.amount
          };

          if(redeem) out.redeemScript = redeem;
          outputs.push(out);
      });

      client.signRawTransaction(tx, outputs, pkeys, 'ALL', (err, resTx) => {
        if(err){
          reject(err);
        }else{
          console.log(resTx);
          resolve(resTx);
        }
      });

    });

  });

}



/*
* Get a transaction info from the blockchain
* @param txid - The transaction hash id
* @return - Return a Promise with the result of the transaction info
*/
const getTransaction = ({txid: id}) => {
  return new Promise((resolve, reject) => {
    let client = bitcoinClient();
    client.getTransaction(id, true, (err, tx) =>{
      if(err){
        reject(err);
      }else{
        resolve(tx);
      }
    });
  });
}


const Transaction = {
  newTransaction: newTransaction,
  broadcastTransaction: broadcastTransaction,
  signTransaction: signTransaction,
  getTransaction: getTransaction
};

module.exports = Transaction;



