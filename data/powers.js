const fs = require('fs');
const path = require('path');

module.exports = {
  tags: ['powers', 'law'],
  entities: [{
    name: 'PACE, Section 1: Stop & Search',
    tags: ['pace', '1984', 'stop', 'search'],
    data: fs.readFileSync(path.join(__dirname, 'stop_search.txt')).toString()
  }]
};
