'use strict';
/*
* Define the corschain Models
*/

function AccountModel(){
  this.walletAccount = null;
	this.address = null;
	this.threshold = null;
	this.keys = [];
  this.scriptPubKey = null;
  this.redeemScript = null;
  this.confirmed_balance = 0.00000000;
  this.unconfirmed_balance = 0.00000000;
  this.type =  "standardMultisig";
	this.platform = null;
	this.createdAt = Date.now();
}

function PubkeyBox(){
	this.escPubkey1 = null;
	this.escPubkey2 = null;
	this.sellerPubkey = null;
	this.buyerPubkey = null;
}


function BasicTxModel(){
	this.outputAddress = "";
	this.outputs = [{toAddress: "", amount: 0}];
	this.changeAddress = "";
	this.fee = 10000;
}


function MultisigTxModel(){
	this.outputAddress = "";
	this.publicKeys = [];
	this.threshold =  1;
	this.outputs = [{toAddress: "", amount: 0}];
	this.changeAddress = "";
	this.fee = 10000;
  this.network = 'test';
}


module.exports = {
	AccountModel: AccountModel,
	PubkeyBox: PubkeyBox,
	BasicTxModel: BasicTxModel,
	MultisigTxModel: MultisigTxModel
}
