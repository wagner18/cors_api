import * as _ from 'lodash';
/* eslint-disable max-len */
export const constants = {
  common: {
    socket: {
    },
    storage: {
      userId: 'userId'
    },
    firebase: {
      config: {
        apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
        authDomain: 'xxxxxxxxxxxxxxxxxxxxxx',
        databaseURL: 'https://xxxxxxxxxx',
        projectId: 'xxxxxxxxxxxx',
        storageBucket: 'xxxxxxxxxxxx',
        messagingSenderId: '0000000000000000'
      },
      endpoint: 'https://xxxxxxxxx.firebaseio.com',
      corschain: 'corschain/',
      profiles: 'profiles/',
      sellerProfiles: 'seller_profiles/',
      shortProfiles: 'short_profiles/'
    }
  },
  development: {
    env: 'development',
    protocol: 'http',
    origin: 'localhost:9000',
    websocketProtocol: 'ws',
  },
  staging: {
    env: 'staging',
    protocol: 'http',
    origin: 'staging.xxxxxx.com',
    websocketProtocol: 'ws',
  },
  production: {
    env: 'production',
    protocol: 'https',
    origin: 'xxxxxxx.com',
    websocketProtocol: 'wss',
  }
};


export default _.merge(constants.common, constants[process.env.NODE_ENV || 'development']);
