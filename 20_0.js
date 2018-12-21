const getSize = field => ({ width: field.length, height: field[0].length });
const printField = (field, loc) => {
  const { width, height } = getSize(field);
  for(let y = 0; y < height; y += 1) {
    const line = [];
    for(let x = 0; x < width; x += 1) {
      const cell = (loc && x === loc[0] && y === loc[1]) ? 'X' : field[x][y];
      line.push(cell);
    }
    console.log(line.join(''));
  }
  console.log('');
}
const getField = (width, height, center = '.') => {
  return Array.from({ length: width}, () => Array.from({ length: height }, () => ''))
  .map((col, colIndex) => col.map((cell, cellIndex) => {
    if (colIndex % 2 == 0 && cellIndex % 2 === 0) {
      return '#';
    } else if (colIndex % 2 === 0 || cellIndex % 2 === 0) {
      return '?';
    }
    return center;
  }));
}

const addArea = (field, dir) => {
  const { width, height } = getSize(field);
  let newField = (dir === 'W' || dir === 'E') ? getField(width + 2, height) : getField(width, height + 2);
  for(let i = 0; i < width; i++) {
    for(let j = 0; j < height; j++) {
      switch(dir) {
        case 'N': newField[i][j+2] = field[i][j]; break;
        case 'E': newField[i][j] = field[i][j]; break;
        case 'S': newField[i][j] = field[i][j]; break;
        case 'W': newField[i+2][j] = field[i][j]; break;
      }
    }
  }
  return newField;
}
const getMoveDeltas = dir => {
  const deltas = { N: [0, -2], E: [2, 0], S: [0, 2], W: [-2, 0] };
  return deltas[dir];
}
const move = (field, currLoc, dir, locStack) => {
  let [x, y] = currLoc;
  const [dx, dy] = getMoveDeltas(dir);
  let newField = field;
  let newLocStack = locStack;

  if(!newField[x+dx] || !newField[x+dx][y+dy]) {
    newField = addArea(field, dir);
    if (dir === 'N') {
      y+=2;
      newLocStack = newLocStack.map(([x,y]) => ([x, y+2]));
    } else if (dir === 'W') {
      x += 2;
      newLocStack = newLocStack.map(([x,y]) => ([x+2, y]));
    }
  }
  switch(dir) {
    case 'N': newField[x][y-1] = '-'; break;
    case 'E': newField[x+1][y] = '|'; break;
    case 'S': newField[x][y+1] = '-'; break;
    case 'W': newField[x-1][y] = '|'; break;
  }
  return { field: newField, currLoc: [x+dx,y+dy], locStack: newLocStack };
}

const findStart = field => {
  for(let i = 0; i < field.length; i++) {
    for(let j = 0; j < field[0].length; j++) {
      if(field[i][j] === 'S') {
        return { x: i, y: j };
      }
    }
  } 
}
const buildMap = (path) => {
  let field = getField(3, 3, 'S');
  let currLoc = [1,1];
  let locStack = [];
  const pathStack = [];

  path.split('').forEach((dir) => {
    if(['N', 'E', 'S', 'W'].includes(dir)) {
      const res = move(field, currLoc, dir, locStack);
      field = res.field;
      currLoc = res.currLoc;
      locStack = res.locStack;
    } else if (dir === '(') {
      locStack.push(currLoc);
    } else if (dir === ')') {
      locStack.pop();
    } else if (dir === '|') {
      currLoc = locStack[locStack.length-1];
    }
  });

  field = field.map(col => col.map(cell => (cell === '?' ? '#' : cell)));
  const startLoc = findStart(field);
  return { field, startLoc };
}

module.exports = {
  buildMap,
  printField,
}