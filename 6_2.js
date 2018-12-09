const fs = require('fs');

const fileData = fs.readFileSync('./6_0_input.txt', 'utf8');
const THRESHOLD = 10000;
const inputData = fileData.split('\r\n').map(line => {
  const [x, y] = line.split(', '); 
  return [Number(x), Number(y)];
});

const max = arr => Math.max(...arr);
const xMax = max(inputData.map(([x]) => x));
const yMax = max(inputData.map(([, y]) => y));

const make2DArray = (width, height) => {
  return Array.from({ length: width }, () => (
    Array.from({ length: height }, () => 0)
  ))
};

const field = make2DArray(xMax + 2, yMax + 2);

const getDistance = (x1, y1, x2, y2) => (Math.abs(x1 - x2) + Math.abs(y1 - y2));
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));

const setAreas = (field, peaks) => field.map((col, colIndex) => col.map((cell, cellIndex) => {
  const distances = peaks.map(([x, y]) => getDistance(x, y, colIndex, cellIndex));
  const distanceSum = distances.reduce((acc, dist) => (acc + dist), 0);

  return distanceSum < THRESHOLD ? '!' : '.'; 
}));

const countArea = (field) => {
  let counter = 0;
  field.forEach(col => col.forEach(cell => {
    if(cell === '!') {
      counter += 1;
    }
  }))

  return counter;
}

const claimedField = setAreas(field, inputData);
console.log(transpose(claimedField).map(line => line.join(', ')))

const safeArea = countArea(claimedField);
console.log(safeArea);