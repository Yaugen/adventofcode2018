const fs = require('fs');

const fileData = fs.readFileSync('./8_0_input.txt', 'utf8');
const inputData = fileData.split(' ').map(item => Number(item));

let totalMetaSum = 0;
const parseInput = () => {
  const childCount = inputData.shift();
  const metaCount = inputData.shift();
  const node = { childCount, metaCount };

  if (childCount > 0) {
    node.children = Array.from({ length: childCount }, () => parseInput());
  }

  if (metaCount > 0) {
    node.meta = Array.from({ length: metaCount }, () => inputData.shift());
  }
  node.metaSum = node.meta.reduce((acc, item) => acc + item, 0);
  totalMetaSum += node.metaSum;

  return node;
}

const root = parseInput();
console.log(totalMetaSum);
