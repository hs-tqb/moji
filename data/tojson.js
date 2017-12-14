const fs = require('fs');

let content = fs.readFileSync('./1.csv', 'utf8');
let result = content.split(/[\r\n]/).map(row => {
  return row.split(',');
});

fs.writeFile('1.json', JSON.stringify(result), 'utf8');