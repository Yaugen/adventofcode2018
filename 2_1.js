const fs = require('fs');

const { processTwoesAndThrees, findAlmostDuplicates } = require('./2_0');

const inputData = JSON.parse(fs.readFileSync('./2_0_input.json', 'utf8'));

const res = processTwoesAndThrees(inputData);
const [twoes, threes] = res;
console.log(res, twoes * threes);

const dups = findAlmostDuplicates(inputData);
console.log(dups, dups[0]
  .split('')
  .filter((char, index) => dups[1][index] === char)
  .join(''));