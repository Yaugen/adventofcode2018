const fs = require('fs');

const fileData = fs.readFileSync('./6_0_input_test.txt', 'utf8');
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
const sorter = (a, b) => a.distance-b.distance;
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));

const setAreas = (field, peaks) => field.map((col, colIndex) => col.map((cell, cellIndex) => {
  const distances = peaks.map(([x, y], peakIndex) => {
    return ({
      distance : getDistance(x, y, colIndex, cellIndex),
      peakIndex,
      coords: `x:${x} y:${y} colIndex:${colIndex} cellIndex:${cellIndex}`,
    })
  });

  const sortedDistances = distances.sort(sorter);
  console.log(sortedDistances.map(dist => JSON.stringify(dist)));
  
  const [minDistance, nextDistance] = sortedDistances;

  return minDistance.distance === nextDistance.distance ? '.' : minDistance.peakIndex; 
}));

const claimedField = setAreas(field, inputData);
console.log(transpose(claimedField).map(line => line.join(', ')))


const getPeaksOfFiniteAreas = (field, peaks) => {
  const allPeaks = new Set(inputData.map((_,index) => index));
  const traverseCells = arr => arr.forEach(cell => allPeaks.delete(cell))
  
  traverseCells(field[0]);
  traverseCells(field[field.length - 1]);
  traverseCells(field.map(col => col[0]));
  traverseCells(field.map(col => col[col.lenght -1]));

  return allPeaks;
}

const finitePeaks = getPeaksOfFiniteAreas(claimedField, inputData);
console.log(finitePeaks);

// console.log(inputData, inputData.length, xMax, yMax)

