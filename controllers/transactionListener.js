'use strict';
/*
* Cors blockchain listener
* Author: Wagner Borba
* version: 0.0.1
*/

import * as _ from 'lodash';
import bitcoinClient from '../modules/corschain/bitcoin/bitcoinCli';
import * as Corschain from '../modules/corschain/middleware';
import * as DataService from '../models/dataService';

const PROFILE_WALLET_REF = "wallets/";
const BITCOIN_REQ_CONF = 1;
const BTICOIN_TX_REFERENCE = "corschain/bitcoin/transactions/";
const BITCOIN_ADDRESS_REF = "corschain/bitcoin/addresses/";
const ETHEREUM_ADDRESS_REF = "corschain/ethereum/addresses/";
const LITECOIN_ADDRESS_REF = "corschain/litecoin/addresses/";
const TX_REFERENCE = "transactions/";


/*
* Bitcoin Transaction listener
*/
export function bitcoinListener(request, reply) {
  console.log(request.params.txid);
  let client = bitcoinClient();
  client.getTransaction(request.params.txid, true, (err, tx) => {
    if(err){
      console.log(err);
      reply({ ERROR: err.message });
    }else{
      // process unconfirmed and confirmed related transaction
      setBitcoinTransaction(tx);
      reply({ reponse: 200 , txid: tx.txid });
    }
  });
}

// TODO
export function ethereumListener(){
  //..
}

//TODO
export function litecoinListener(){
  //..
}


/*
* Set the transaction correlated balance to the involved addresses
* @param tx - Transaction information by the wallet notify
*/
const setBitcoinTransaction = (tx) => {

  let platform = "bitcoin";

  let client = bitcoinClient();
  _.forEach(tx.details, (detail) => {

    if(detail.category === "receive"){

      client.listUnspent(0, 1e7, [detail.address], (err, utxouts) => {

        console.log("\nAddress: ", detail.address);
        console.log("Account: ",detail.account);

        let addressObj = {};
        let totalBalance = 0;
        let unTotalBalance = 0;

        _.forEach(utxouts, (utxou) => {

          if(utxou.confirmations >= BITCOIN_REQ_CONF){
            totalBalance += utxou.amount;
          }else{
            unTotalBalance += utxou.amount;
          }

        });

        addressObj.confirmed_balance = totalBalance;
        addressObj.unconfirmed_balance = unTotalBalance;

        saveTransactionInfo(platform, tx, detail.address, addressObj);

      });

    }
  });

}



// TODO
const setEthereumTransaction = (tx) => {
  //..
}


//TODO
const setLitecoinTransaction = (tx) => {

}


/*
* Update the database with the new balance and transaction ID
* @param Platform - The platform which the transaction belongo to, bitcoin, ethereum or litecoin.
* @param tx - The transaction infomation to be stored
* @param addr - The receive address of the transaction
* @param data - Object data with the new confirmed and uncofirmed balance
*/
const saveTransactionInfo = (platform, tx, addr, data) => {

  // update the balance at the owners wallet
  if(platform == "bitcoin") {
    //Get address owner
    DataService.database().child(BITCOIN_ADDRESS_REF + addr).once("value", (addrSnap) => {

      let owner = addrSnap.val();
      if(owner){

        let ownerRef = PROFILE_WALLET_REF + owner + "/bitcoin_account/";
        // update the balance at the owners wallet
        DataService.database().child(ownerRef + addr).update(data).then(() => {

          let shortTx = {
            confirmations: tx.confirmations,
            hex: tx.hex,
            time: tx.time
          };

          console.log("Address updated.");
          // save the transaction id into the owner wallet
          return DataService.database().child(ownerRef + TX_REFERENCE + tx.txid).set(shortTx)

        })
        .catch((error) => {
          console.log(error);
          throw new Error(error.message);
        });

      }else{
        console.log("There is no owner for the given address: " + addr);
      }

    },
    (error) => {
      console.log(error);
      throw new Error(error.message);
    });

  }
  // TODO
  else if(platform == "ethereum"){
    //..
  }
  // TODO
  else if(platform == "litecoin"){
    //...
  }

}


// let client = bitcoinClient();
// client.getTransaction("ebbc853bd192ccf0f6e4e00f117bcecc66269f9895d40f5ffdf9344495958c8c", true, (err, tx) => {

//   setBitcoinTransaction(tx);

// });




