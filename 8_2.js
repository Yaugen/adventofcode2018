const fs = require('fs');

const fileData = fs.readFileSync('./8_0_input.txt', 'utf8');
const inputData = fileData.split(' ').map(item => Number(item));

const getNodeValue = (node) => {
  if (node.childCount === 0) {
    return node.metaSum;
  }
  return node.meta.reduce((acc, metaItem) => {
    const referencedChild = node.children[metaItem - 1];
    if(!referencedChild) {
      return acc;
    }
    return acc + referencedChild.value;
  }, 0)
}

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

  node.value = getNodeValue(node);

  return node;
}

const root = parseInput();
console.log(root.value);
