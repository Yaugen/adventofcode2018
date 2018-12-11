const SERIAL_NUMBER = 9995;
const FIELD_SIZE = 300;
const field = Array.from({ length: FIELD_SIZE }, () => Array.from({ length: FIELD_SIZE }, () => 0))

const getHundredsDigit = num => Math.floor(num % 1000 /100);

const getPowerLevel = (x, y, serial) => {
  const rackId = x + 10;
  return getHundredsDigit((rackId * y + serial) * rackId) - 5;
}

const getSquareSum = (field, x, y, size) => {
  let sum = 0;
  for(let i = x; i < x + size; i += 1) {
    for(let j = y; j < y + size; j += 1) {
      sum += field[i][j];
    }
  }
  return sum;
}

const getAreaWithMaxSum = field => {
  let maxSum = { sum: 0 };
  for(let size = 1; size < FIELD_SIZE; size += 1) {
    for(let x = 0; x < FIELD_SIZE - size; x += 1) {
      for(let y = 0; y < FIELD_SIZE - size; y += 1) {
        const sum = getSquareSum(field, x, y, size);
        if (sum > maxSum.sum) {
          maxSum = { sum, x, y, size }; 
        }
      }
    }
  }
  return maxSum;
}

const fieldWithLevels = field.map((col, colIndex) => (
  col.map((cell, cellIndex) => (
    getPowerLevel(colIndex, cellIndex, SERIAL_NUMBER)
  ))
));

console.log(getAreaWithMaxSum(fieldWithLevels));
