const fs = require('fs');
const path = require('path');

module.exports = {
  tags: ['define'],
  entities: [{
    name: 'GOWISELY',
    tags: ['gowisely'],
    data: fs.readFileSync(path.join(__dirname, 'definitions/gowisely.txt')).toString()
  }]
};
