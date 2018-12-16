const fs = require('fs');
const { getInitialData, getFieldWithData, printField, sorter } = require('./15_0');

const rawData = fs.readFileSync('./15_0_input.txt', 'utf8');
const WIDTH = rawData.split('\n')[0].length - 1;
const HEIGHT = rawData.split('\n').length;


const getNeighbours = (field, { x, y }) => {
  const neighbours = [];
  if(field[x-1] && field[x-1][y]) {
    neighbours.push({ x: x-1, y, v: field[x-1][y]});
  }
  if(field[x+1] && field[x+1][y]) {
    neighbours.push({ x: x+1, y, v: field[x+1][y]});
  }
  if(field[x] && field[x][y-1]) {
    neighbours.push({ x, y:y-1, v: field[x][y-1]});
  }
  if(field[x] && field[x][y+1]) {
    neighbours.push({ x, y:y+1, v: field[x][y+1]});
  }
  return neighbours;
}
const fillDistances = (field, from, current = 0) => {
  const neighbours = getNeighbours(field, from).filter(({ v }) => v === '.' || (Number.isInteger(v) && v >= current + 1 ));
  if(neighbours.length) {
    neighbours.forEach(n => {
      field[n.x][n.y] = current + 1;
      fillDistances(field, n, current + 1)
    });

  }
}
const {elfs, goblins, emptyField } = getInitialData(rawData, WIDTH, HEIGHT);
const step = (unit, isElf, elfs, goblins) => {
  const units = [...elfs, ...goblins].sort(sorter);
  const currentField = getFieldWithData(emptyField, units);
  fillDistances(currentField, elfs[0]);
  const goblinsReachable = goblins.map(goblin => {
    const neighbours = getNeighbours(currentField, goblin);
    const reachable = neighbours.filter(({ v }) => Number.isInteger(v));
    const minReachable = reachable.reduce((min, item) => (item.v < min.v ? item : min), { v: Number.MAX_VALUE })
    return { ...goblin, minReachable };
  })
  printField(currentField);
  console.log(goblinsReachable);
}

step(null, null, elfs, goblins);
