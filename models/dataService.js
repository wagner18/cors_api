/**
* Provide a single place to connect with the data structure on the application (Firebase 3)
* Version: 1.0.0
* Author: Wagner Borba
*/

import Firebase from 'firebase';
import GeoFire from 'geofire/dist/geofire';
import constants from '../constants';

const ROOT_NODE = "/";

(function() {
	Firebase.initializeApp(constants.firebase.config);
})();


// Expose authentication object
export const auth = () => {
  return Firebase.auth();
}

/*
* Set the Firebase reference to the root node
*/
export const database = () => {
  return Firebase.database().ref(ROOT_NODE);
}

/*
* Expose the storage object
*/
export const Storage = () => {
  return Firebase.storage();
}

/*
* Define a default storage reference
*/
export const storageRef = () => {
  return Firebase.storage().ref(ROOT_NODE);
}

/*
* Expose GeoFire Library
*/
GeoFireLib(){
  return GeoFire;
}

/*
* Expose GeoFire object
*/
export const geofire = () => {
  let geoFire = new GeoFire(firebase.database().ref(ROOT_NODE + constants.firebase.listings_geofire ));
  return geofire;
}




/**
*
*/
export const setGeolocation = (geoData) => {
  geoFire.set(geoData.key, geoData.location)
  .catch(error => {
    console.log(error);
  });
}

  // /**
  // * Set Http object and expose it to the caller
  // * return the Http object
  // */
  // getHttp(){
  //   return this.http;
  // }

  /**
  *
  */
  imageRef() {
    let imageRef = storageRef.ref("images/");
    return imageRef;
  }

