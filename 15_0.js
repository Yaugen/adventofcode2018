const sorter = (a, b) => (a.y === b.y ? a.x - b.x : a.y -b.y);
const getSize = field => ({ WIDTH: field.length, HEIGHT: field[0].length });
const printField = (field) => {
  const { WIDTH, HEIGHT } = getSize(field);
  for(let y = 0; y < HEIGHT; y += 1) {
    const line = [];
    for(let x = 0; x < WIDTH; x += 1) {
      const cell = field[x][y].toString();
      if(cell.length === 2) {
        line.push(cell);
      } else {
        line.push(cell,cell);
      }
      // line.push(field[x][y]);
    }
    console.log(line.join(''));
  }
}
const getFieldWithData = (field, data = []) => {
  const { WIDTH, HEIGHT } = getSize(field);
  const emptyField = Array.from({ length: WIDTH }, () => Array.from({ length: HEIGHT }));
  for(let x = 0; x < WIDTH; x++) {
    for( let y = 0; y < HEIGHT; y++) {
      const dataEntry = data.length && data.find(item => item.x === x && item.y == y);
      emptyField[x][y] = dataEntry ? dataEntry.v : field[x][y];
    }
  }
  return emptyField;
}
const getInitialData = (rawData) => {
  const goblins = [];
  const elfs = [];
  const raw = rawData.split('\r\n');
  const { WIDTH, HEIGHT } = getSize(raw);
  const emptyField = Array.from({ length: WIDTH }, () => Array.from({ length: HEIGHT }));

  for(let x = 0; x < WIDTH; x++) {
    for( let y = 0; y < HEIGHT; y++) {
      const cell = raw[y][x];
      if(cell === 'G') {
        goblins.push({ x, y, hp: 200, dmg: 3, v: cell, state: 'start' });
        
      } else if (cell === 'E') {
        elfs.push({ x, y, hp: 200, dmg: 3, v: cell, state: 'start' });
      }
      emptyField[x][y] = (cell === 'E' || cell === 'G' ? '.' : cell);
    }
  }
  elfs.sort(sorter);
  goblins.sort(sorter);

  return { 
    emptyField,
    units: [...elfs, ...goblins].sort(sorter)
  };
}

const getNeighbours = (field, { x, y }) => {
  const neighbours = [];
  if(field[x] && field[x][y-1]) {
    neighbours.push({ x, y:y-1, v: field[x][y-1]});
  }
  if(field[x-1] && field[x-1][y]) {
    neighbours.push({ x: x-1, y, v: field[x-1][y]});
  }
  if(field[x+1] && field[x+1][y]) {
    neighbours.push({ x: x+1, y, v: field[x+1][y]});
  }
  if(field[x] && field[x][y+1]) {
    neighbours.push({ x, y:y+1, v: field[x][y+1]});
  }
  return neighbours;
}

const fillDistances = (field, from, current = 0) => {
  const neighbours = getNeighbours(field, from).filter(({ v }) => v === '.' || (Number.isInteger(v) && v > current + 1 ));
  if(neighbours.length) {
    neighbours.forEach(n => {
      field[n.x][n.y] = current + 1;
      fillDistances(field, n, current + 1)
    });
  }
  return field;
}
const getFieldWithDistances = (field, from) => {
  const newField = getFieldWithData(field);
  fillDistances(newField, from);
  return newField;
}

const getReachebleUnits = (fieldWithDistances, units) => {
  return units.map(unit => {
    const neighbours = getNeighbours(fieldWithDistances, unit);
    const allReachable = neighbours.filter(({ v }) => Number.isInteger(v));
    const minReachable = allReachable.reduce((min, item) => (item.v < min.v ? item : min), { v: Number.MAX_VALUE })
    return { ...unit, isReachable: minReachable.x ? minReachable : false };
  }).filter(unit => unit.isReachable);
}

const getTarget = (fieldWithDistances, units) => {
  const reachableUnits = getReachebleUnits(fieldWithDistances, units);
  if(reachableUnits.length) {
    return reachableUnits.reduce((target, unit) => {
      return unit.isReachable.v < target.isReachable.v ? unit : target
    }, { isReachable: { v: Number.MAX_VALUE } })
  }
  return false;
}

const getPath = (field, from, to) => {
  const start = { x: from.x, y: from.y, v: 0, path: [] };
  const q = [start];
  while(q.length > 0) {
    const current = q.shift();
    const neighbours = getNeighbours(field, current);
    const validNeighbours = neighbours.filter(({ v }) => Number(v) && v === current.v + 1);
    const validWithPath = validNeighbours.map(item => ({ ...item, path: [...current.path, { x: item.x, y: item.y }] }));

    const target = validWithPath.find(({ x, y }) => x === to.x && y === to.y);
    if(target) {
      return target.path;
    }
    validWithPath.forEach(item => {
      const hasItem = q.find(qItem => qItem.x === item.x && qItem.y === item.y);
      if(!hasItem) {
        q.push(item);
      }
    });
  }
}

module.exports = {
  sorter,
  getSize,
  printField,
  getFieldWithData,
  getInitialData,
  getNeighbours,
  getFieldWithDistances,
  getTarget,
  getPath,
}