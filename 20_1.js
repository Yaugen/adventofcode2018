const fs = require('fs');
const input = fs.readFileSync('./20_0_input.txt', 'utf8');
const { printField, buildMap } = require('./20_0');

let { field, startLoc } = buildMap(input);


const getNeighbours = (field, {x, y}) => {
  return [
    { x, y: y-1, v: field[x][y-1], target: { x, y: y-2 } },
    { x: x+1, y, v: field[x+1][y], target: { x: x+2, y } },
    { x, y: y+1, v: field[x][y+1], target: { x, y: y+2 } },
    { x: x-1, y, v: field[x-1][y], target: { x: x-2, y } },
  ]
    .filter(n => n.v !== '#')
    .map(({ target: { x, y } }) => ({ x, y, v: field[x][y] }));
}

const fillDistances = (field, from) => {
  const queue = [{ ...from, v: 0 }];

  while(queue.length > 0) {
    const currCell = queue.shift();
    const neighbours = getNeighbours(field, currCell).filter(({ v }) => v === '.' || (Number.isInteger(v) && v > currCell.v + 1 ));
    neighbours.forEach(n => {
      field[n.x][n.y] = currCell.v + 1;
      queue.push({ ...n, v: currCell.v + 1 });
    })
  } 

  return field;
}
const getMaxDist = field => {
  let max = 0;
  for(let i = 0; i < field.length; i++) {
    for(let j = 0; j < field[0].length; j++) {
      if(Number.isInteger(field[i][j])) {
        max = Math.max(max, field[i][j]); 
      }
    }
  }
  return max;
}
const countDist = field => {
  let counter = 0;
  for(let i = 0; i < field.length; i++) {
    for(let j = 0; j < field[0].length; j++) {
      if(Number.isInteger(field[i][j]) && field[i][j] >= 1000) {
        counter += 1;
      }
    }
  }
  return counter;
}

printField(field);
field = fillDistances(field, startLoc);
printField(field);
console.log(getMaxDist(field));
console.log(countDist(field));