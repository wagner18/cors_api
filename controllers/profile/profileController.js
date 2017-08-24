import * as _ from 'lodash';
import * as admin from 'firebase-admin';
import * as Corschain from '../../modules/corschain/middleware';
import * as Profile from '../../models/profile/profileModel';
import * as ModelUtil from '../../models/modelUtil';
import * as Model from '../../models/profile/model';

/*
* POST
* Add a new profile with the given data
*/
export function newProfile(request, reply) {

  let data = ModelUtil.loadData(Model.Profile(), request.payload);

  // Create new Bitcoin Wallet accounts
  if(request.payload.wallet_type == "basic"){

    Profile.newProfile(data).then((profileUid) => {

      //Generate the corsbay basic bitcoin account
      return Corschain.newBasicAccountBitcoin(profileUid).then((account) => {
        return saveWallet(account, profileUid);
      })
      .then((setWalletPromise) => {
        reply({ response: 200 });
      });

    })
    .catch((error) => {
      console.log(error);
      reply({ response: 500 });
    });

  }else {

    Profile.newProfile(data).then((profileUid) => {

      //Generate the corsbay standard multisig bitcoin account
      return Corschain.newMultisigAccountBitcoin(profileUid).then((account) => {
        return saveWallet(account, profileUid);
      })
      .then((setWalletPromise) => {
        reply({ response: 200 });
      });

    })
    .catch((error) => {
      console.log(error);
      reply({ response: 500 });
    });

  }

}


/*
* POST
* Update a given profile
*/
export function updateProfile(request, reply) {

  if(request.params.uid){

    let profileUid = request.params.uid;
    Profile.fetchProfile(profileUid).then((profileSnap) => {

      let newData = ModelUtil.loadData(profileSnap, request.payload);
      return Profile.updateProfile(profileUid, newData);

    })
    .then(() => {
      reply({response: 200 });
    })
    .catch((error) => {
      console.log(error);
      reply({response: 500});
    });
  }
  else{
    reply({response: "Profile id missing."});
  }

}

//TODO - Define a specific wallet controller? think this through later!!

/*
*
*/
function saveWallet(account, uid){

  let wallet = Model.Wallet();

  // Set bitcoin Account
  if(account.platform == "bitcoin"){
    wallet.bitcoin_account[account.address] = account;
  }

  return Profile.newWallet(uid, wallet).then(() => {

    return Profile.setWalletAddress({
      platform: account.platform,
      address: account.address,
      uid: uid
    });

  })
  .catch((error) => {
    console.log(error);
  });

}


/*
*
*/
export function updateWalletTransaction(request, reply) {

  //bitcoin
  // Set bitcoin Account
  if(request.params.platform == "bitcoin"){

    return Corschain.getTransactionBitcoin(request.params.txid).then((tx) => {

      const txRef = request.params.uid + "/bitcoin_account/transactions/" + tx.txid;
      const txData = {
        confirmations: tx.confirmations
      }

      return Profile.updateWallet(txRef, txData).then((txRef) => {
        reply(txData);
        return txRef;
      })

    })

    .catch((error) => {
      reply({response: 501, error: error.message });
    });
  }

}



