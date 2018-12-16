const fs = require('fs');

const rawData = fs.readFileSync('./15_0_input.txt', 'utf8');
const WIDTH = rawData.split('\n')[0].length - 1;
const HEIGHT = rawData.split('\n').length;

const sorter = (a, b) => (a.y === b.y ? a.x - b.x : a.y -b.y)
const printField = (field) => {
  for(let y = 0; y < HEIGHT; y += 1) {
    const line = [];
    for(let x = 0; x < WIDTH; x += 1) {
      line.push(field[x][y]);
    }
    console.log(line.join(''));
  }
}
const getFieldWithData = (field, data) => {
  const emptyField = Array.from({ length: WIDTH }, () => Array.from({ length: HEIGHT }));
  for(let x = 0; x < WIDTH; x++) {
    for( let y = 0; y < HEIGHT; y++) {
      const dataEntry = data.find(item => item.x === x && item.y == y);
      emptyField[x][y] = dataEntry ? dataEntry.label : field[x][y];
    }
  }
  return emptyField;
}

const getInitialData = rawData => {
  const goblins = [];
  const elfs = [];
  const emptyField = Array.from({ length: WIDTH }, () => Array.from({ length: HEIGHT }));
  const raw = rawData.split('\r\n');

  for(let x = 0; x < WIDTH; x++) {
    for( let y = 0; y < HEIGHT; y++) {
      const cell = raw[y][x];
      if(cell === 'G') {
        goblins.push({ x, y, hp: 300, dmg: 3, label: cell });
        
      } else if (cell === 'E') {
        elfs.push({ x, y, hp: 300, dmg: 3, label: cell });
      }
      emptyField[x][y] = (cell === 'E' || cell === 'G' ? '.' : cell);
    }
  }
  elfs.sort(sorter);
  goblins.sort(sorter);

  return { elfs, goblins, emptyField };
}

const {elfs, goblins, emptyField } = getInitialData(rawData);

printField(getFieldWithData(emptyField, [...elfs, ...goblins]))
printField(emptyField);
