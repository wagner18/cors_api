import * as _ from 'lodash';
import * as bitcoinController from './controllers/bitcoin/bitcoinController';
import * as transactionListener from './controllers/transactionListener';
import * as profileController from './controllers/profile/profileController';
import * as auth from './controllers/auth';
import config from './config';

auth.initializeFirebase();

export default function (server) {
  /**
   * Social Logins Configs
   * key: https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
   */
  server.auth.strategy('token', 'jwt', {
    key: config.firebase.key,
    validateFunc: auth.verifyToken,
    verifyOptions: {
      algorithms: config.firebase.algorithm,
      issuer: config.firebase.issuer,
      audience: config.firebase.audience
    },
    tokenType: 'Bearer'
  });

  server.route({
    method: 'GET',
    path: '/bitcoinListener/{txid}',
    handler: transactionListener.bitcoinListener
  });

  server.route({
    method: 'POST',
    path: '/profile/newProfile',
    handler: profileController.newProfile
  });

  server.route({
    method: 'PUT',
    path: '/profile/updateProfile/{uid}',
    handler: profileController.updateProfile
  });


  server.route({
    method: 'GET',
    path: '/bitcoin/getBalance/{account}',
    handler: bitcoinController.getBalance
  });

  server.route({
    method: 'GET',
    path: '/bitcoin/getTransaction/{txid}',
    handler: bitcoinController.getTransaction
  });
}
