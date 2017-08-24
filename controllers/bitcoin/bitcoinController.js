import * as Corschain from '../../modules/corschain/middleware';


/*
* GET
* Reply the address balance
*/
export function getBalance(request, reply) {
  if(request.params.account == undefined){
    Corschain.getAccountBalanceBitcoin(request.params.account).then((balance) => {
      if(balance != undefined || balance != null)
        reply({ response: balance });
    })
    .catch((error) => {
      console.log(error);
      reply({ response: error.message });
    });
  }else{
    reply({ response: "account name invalid." });
  }

}

/*
* GET
* Reply the transaction info
*/
export function getTransaction(request, reply) {
  if(request.params.txid){
    Corschain.getTransactionBitcoin(request.params.txid).then((tx) => {
      if(tx != undefined || tx != null)
        reply({ response: tx });
    })
    .catch((error) => {
      console.log(error);
      reply({ response: error.message });
    });
  }else{
    reply({ response: "transaction id invalid." });
  }
}