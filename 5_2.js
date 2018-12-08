const fs = require('fs');
const {
  reducePolymer
} = require('./5_0');

const polymerStr = fs.readFileSync('./5_0_input.txt', 'utf8');
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const traversePolymer = () => {
  return ALPHABET
    .split('')
    .map(char => {
      const polymerWithoutChar = polymerStr.replace(new RegExp(char, 'gi'), '');
      const reducedPolymer = reducePolymer(polymerWithoutChar.split(''));
      return reducedPolymer.length
    })
    .reduce((min, polymerLength) => {
      return polymerLength < min ? polymerLength : min
    }, Number.MAX_SAFE_INTEGER)
}


console.log('ANSWER', traversePolymer())