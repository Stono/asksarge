'use strict';
const fs = require('fs');
const path = require('path');

const file = name => {
  return fs.readFileSync(path.join(__dirname, `powers/${name}.txt`)).toString();
};

module.exports = {
  tags: ['power', 'law'],
  groups: [{
    tags: ['pace'],
    entities: [
      {
        name: 'PACE, Section 1: Stop & Search',
        tags: ['section1', 'stop', 'search'],
        data: file('pace_section1_stopsearch')
      },
      {
        name: 'PACE, Section 117: Power of constable to use reasonable force',
        tags: ['section117', 'use', 'force'],
        data: file('pace_section117_constable_power')
      },
      {
        name: 'PACE, Section 17: Entry and search without search warrant',
        tags: ['section17', 'entry', 'search'],
        data: file('pace_section17_entry')
      },
      {
        name: 'PACE, Section 18 (1): Entry and search following custody',
        tags: ['section18', 'entry', 'search'],
        data: file('pace_section18_1_entry')
      },
      {
        name: 'PACE, Section 18 (5): Entry and search before custody',
        tags: ['section18', 'entry', 'search'],
        data: file('pace_section18_5_entry')
      },
      {
        name: 'PACE, Section 19: General power of seizure',
        tags: ['section19', 'seizure', 'seize'],
        data: file('pace_section19_seizure')
      },
      {
        name: 'PACE, Section 22: Retaining seized items',
        tags: ['section22', 'seizure', 'seize', 'retain'],
        data: file('pace_section22_seizure')
      },
      {
        name: 'PACE, Section 24: Power of arrest',
        tags: ['section24', 'arrest'],
        data: file('pace_section24_power_of_arrest')
      },
      {
        name: 'PACE, Section 32: Search upon arrest',
        tags: ['section32', 'arrest', 'search'],
        data: file('pace_section32_search_upon_arrest')
      },
      {
        name: 'PACE, Section 54: Search a detained person',
        tags: ['section54', 'search', 'detained'],
        data: file('pace_section54_search_detained_person')
      }
    ]
  }],
  entities: [{
    name: 'Criminal Law Act, Section 3: Use of reasonable force in making an arrest',
    tags: ['section3', 'criminal', 'use', 'force'],
    data: file('crim_law_section_3_reasonable_force')
  }]
};
