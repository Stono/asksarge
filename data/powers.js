'use strict';
const fs = require('fs');
const path = require('path');

const file = name => {
  return fs.readFileSync(path.join(__dirname, `powers/${name}.txt`)).toString();
};

module.exports = {
  tags: ['powers', 'power', 'law'],
  entities: [{
    name: 'PACE, Section 1: Stop & Search',
    tags: ['pace', 'stop', 'search'],
    data: file('pace_section1_stopsearch')
  },
  {
    name: 'PACE, Section 117: Power of constable to use reasonable force',
    tags: ['pace', 'use', 'force'],
    data: 'A constable may use such force as is reasonable and necessary in the exercise of their power of arrest or duty'
  },
  {
    name: 'PACE, Section 17: Entry and search without search warrant',
    tags: ['pace', 'entry', 'search'],
    data: file('pace_section17_entry')
  },
  {
    name: 'Criminal Law Act, Section 3: Use of reasonable force in making an arrest',
    tags: ['criminal', 'use', 'force'],
    data: 'A person may use such force as is reasonable in the circumstances in the prevention of crime, or in effecting or assisting in the lawful arrest of offenders or suspected offenders or of persons unlawfully at large.'
  }]
};
