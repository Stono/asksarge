'use strict';
module.exports = {
  port: 8999,
  elasticsearch: process.env.ELASTICSEARCH_HOST || 'localhost',
  name: 'Sarge'
};
