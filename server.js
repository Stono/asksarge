'use strict';
const config = require('./config');
const app = new require('./lib/app')(config);
app.start();
