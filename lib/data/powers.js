'use strict';
const fs = require('fs');
const path = require('path');

const file = name => {
  return fs.readFileSync(path.join(__dirname, `powers/${name}.txt`)).toString();
};

module.exports = {
  tags: ['power', 'law'],
  entities: [{
    name: 'PACE, Section 1: Stop & Search',
    tags: ['section1', 'pace', 'stop', 'search'],
    data: file('pace_section1_stopsearch')
  },
  {
    name: 'PACE, Section 117: Power of constable to use reasonable force',
    tags: ['section117', 'pace', 'use', 'force'],
    data: file('pace_section117_constable_power')
  },
  {
    name: 'PACE, Section 17: Entry and search without search warrant',
    tags: ['section17', 'pace', 'entry', 'search'],
    data: file('pace_section17_entry')
  },
  {
    name: 'Criminal Law Act, Section 3: Use of reasonable force in making an arrest',
    tags: ['section3', 'criminal', 'use', 'force'],
    data: file('crim_law_section_3_reasonable_force')
  }]
};
