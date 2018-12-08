const fs = require('fs');

const {
  parseInputLine,
  findMaxRightAndBottom,
  make2DArray,
  claimAllAreas,
  countOverlaps,
  findNotOverlapped,
} = require('./3_0');

const inputData = JSON.parse(fs.readFileSync('./3_0_input.json', 'utf8'))
  .map(parseInputLine);

const { maxRight, maxBottom } = findMaxRightAndBottom(inputData);
const field = make2DArray(maxRight, maxBottom);

const claimedField = claimAllAreas(field, inputData);
const overlaps = countOverlaps(claimedField);
console.log(overlaps);


const notOverlaped = findNotOverlapped(claimedField, inputData);
console.log(notOverlaped);