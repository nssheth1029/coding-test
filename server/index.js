'use strict';

let config = require('../config/config.js');

config.preloadData().then(() => {
  console.log("data loaded");
  const server = require("./server");
  server.start();
}).catch(err => {
  console.log("Error Starting Server");
  console.log(err);
  process.exit(1);
});
