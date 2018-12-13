const { initialStateRaw, rulesRaw } = require('./12_0_input');

const initialState = initialStateRaw.split('');
const rules = rulesRaw.reduce((acc, item) => {
  const [from, to] = item.split(' => ');
  return { ...acc, [from]: to };
}, {})

const getRowValue = (row, index) => {
  if(index < 0 || index >= row.length) {
    return '.'
  } else {
    return row[index];
  }
}

const getRowPartStr = (row, center) => {
  const res = [];
  for (let i = center - 2; i <= center + 2; i += 1) {
    res.push(getRowValue(row, i));
  }

  return res.join('');
}

const getSum = (row, zeroPotIndex) => (
  row.reduce((acc, item, index) => {
    if(item === '#') {
      return acc + index - zeroPotIndex;
    } 
    return acc;
  }, 0)
);

const print = (row, genIndex, sum, diff, zeroPotIndex) => {
  const rowStr = row.map((item, index) => index === zeroPotIndex ? `(${item})` : item).join('');
  console.log(genIndex, rowStr, sum, diff,)
};


const simulate = (generationsCount) => {
  let currentGeneration = 0;
  let prevGen = initialState;
  let zeroPotIndex = 0;
  let sums = [0, 0, getSum(prevGen, zeroPotIndex)];
  let diffs = [0, 0, 0];

  print(prevGen, currentGeneration, sums, diffs, zeroPotIndex);

  while(currentGeneration < generationsCount) {
    const nextGen = Array.from(prevGen);

    let extraLeft = Array.from({ length: 2 }, () => '.');
    let extraRight = Array.from({ length: 2 }, () => '.');

    for (let i = -2; i < prevGen.length + 2; i += 1) {
      const rowPart = getRowPartStr(prevGen, i);
      const newValue = rules[rowPart] || '.';

      if (i < 0) {
        extraLeft[extraLeft.length + i] = newValue;
      } else if (i >= prevGen.length) {
        extraRight[i - prevGen.length] = newValue
      } else {
        nextGen[i] = newValue;
      }
    }

    extraLeft = extraLeft.includes('#') ? extraLeft : [];
    extraRight = extraRight.includes('#') ? extraRight : [];

    zeroPotIndex += extraLeft.length;

    prevGen = [...extraLeft, ...nextGen, ...extraRight];
    currentGeneration += 1;

    // optimize array size
    if (prevGen.slice(0, 6).join('') === '......') {
      prevGen.shift();
      zeroPotIndex -= 1;
    }

    const newSum = getSum(prevGen, zeroPotIndex);
    const newDiff = newSum - sums[sums.length - 1];

    sums = [...sums.slice(1), newSum];
    diffs = [...diffs.slice(1), newDiff];

    print(prevGen, currentGeneration, sums, diffs, zeroPotIndex);

    if (diffs.every(diff => diff === diffs[0])) {
      console.log((50000000000 - currentGeneration) * diffs[diffs.length - 1] + sums[sums.length - 1]);
      break;
    }
  }
}

simulate(300);