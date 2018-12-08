const fs = require('fs');
const { reducePolymer } = require('./5_0');

const polymerStr = fs.readFileSync('./5_0_input.txt', 'utf8');
console.log(reducePolymer(polymerStr.split('')).length)
