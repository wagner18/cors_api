'use_stric';

const zmq = require('zmq');
const subscriber = zmq.socket('sub');

//subscriber.subscribe("hashtx");
subscriber.subscribe("rawtx");

subscriber.on('message', (topic, msg) => {

  let bufData = msg;
  // let data = JSON.parse(x);
  console.log("\nRaw transaction -> " + bufData.toString('hex'));
});

subscriber.connect('tcp://127.0.0.1:38332');
