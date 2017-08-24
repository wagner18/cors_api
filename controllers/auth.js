import * as admin from "firebase-admin";
import serviceAccount from '../config/xxxxxxxxxxxxxxxxxx-111c7bd68c.json.json';
import config from '../config';

export const initializeFirebase = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL
  });
};

export const verifyToken = (decodedToken, request, next) => {
  const credentials = (decodedToken.id ? decodedToken : {});
  if (!credentials || decodedToken.exp < Date.now()/1000) {
    return next(null, false);
  }
  return next(null, true);
};
