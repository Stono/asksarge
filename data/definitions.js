'use strict';
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pathToDefinitions = path.join(__dirname, 'definitions/*.txt');
const definitions = glob.sync(pathToDefinitions);
module.exports = {
  tags: ['definition'],
  entities: definitions.map(path => {
    const name = path.split('/').pop().split('.')[0];
    return {
      name: name.toUpperCase(),
      tags: [name],
      data: fs.readFileSync(path).toString()
    };
  })
};
