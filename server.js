'use strict';
const config = require('./config');
const app = new require('./lib/app')(config);
app.start(err => {
  if(err) {
    console.error('Failed to start sarge!');
    console.error(err.message);
    process.exit(1);
  }
});
