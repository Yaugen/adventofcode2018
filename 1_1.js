const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./1_1_input.json', 'utf8'));
const res = data.reduce((acc, item) => acc + item, 0);
console.log(res); 