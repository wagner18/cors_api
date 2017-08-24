import * as _ from 'lodash';
import constants from '../../constants';
import * as DataService from '../dataService';
import * as Model from './model';

/*
*  Implement the CRUD functionalities through
*  the api to keep data consistency throughout
*  all clients plataform - AWAYS RETURN A PROMISE
*/


/*
* New profile adding the user uid as profile uid by default
* @param data - Profile Model instance to be stored
* @param ref - Database reference path
* @return - Return a promise with the profile UID key
*/
export function newProfile(data){

  let userUID = "user_uid-" + _.random(5e8, 9e8);
  let profileRef = constants.firebase.profiles + userUID + "/";

  return new Promise((resolve, reject) => {

    data.uid = userUID;
    DataService.database().child(profileRef).set(data).then(() => {
      resolve(userUID);
    }).catch(function(error) {
      reject(error);
    });

  });

}


/*
* Update the user profile
* @param data - Profile Model instance to be stored
* @param ref - Database reference path
* @return - Return a promise
*/
export function updateProfile(uid, data){
  let profileRef = constants.firebase.profiles + uid;
  return DataService.database().child(profileRef).update(data);
}


/*
* Fetch user profile
* @param uid - Profile uid
* @return - Return a promise
*/
export function fetchProfile(uid){
  return new Promise((resolve, reject) => {

    let profileRef = constants.firebase.profiles + uid;
    DataService.database().child(profileRef).once("value", (profileSnap) => {
      resolve(profileSnap.val());
    },
    (error) => {
      reject(error);
    });

  });
}


/*
* New wallet adding the user uid as wallet uid by default
* @param uid - Wallet owner UID
* @param data - Profile Model instance to be stored
* @return - Return a promise with the profile UID key
*/
export function newWallet(uid, data){
  if(uid){

    let walletRef = constants.firebase.wallets + uid + "/";

    return new Promise((resolve, reject) => {
      DataService.database().child(walletRef).set(data).then(() => {
        resolve(uid);
      }).catch(function(error) {
        reject(error);
      });

    });
  }
}


/*
* update wallet
* @param uid - Wallet owner UID
* @param data - Profile Model instance to be stored
*
* @return - Return a promise with the profile UID key
*/
export function updateWallet(uid, data){
  if(uid){

    let walletRef = constants.firebase.wallets + uid + "/";

    return new Promise((resolve, reject) => {

      DataService.database().child(walletRef).update(data).then(() => {
        resolve(uid);
      }).catch(function(error) {
        reject(error);
      });

    });
  }
}

/*
*
*/
export function setWalletAddress({platform: pform, address: addr, uid: id}){
  if(pform && addr && id){

    let addressRef = constants.firebase.corschain + pform + "/addresses/" + addr + "/";
    return new Promise((resolve, reject) => {
      DataService.database().child(addressRef).set(id).then(() => {
        resolve(addr);
      }).catch(function(error) {
        reject(error);
      });
    });

  }else{
    throw new Error("Wallet address could not be set - invalid parameters.");
  }
}




