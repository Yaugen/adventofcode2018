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
const getFieldWithData = (field, data) => {
  const { WIDTH, HEIGHT } = getSize(field);
  const emptyField = Array.from({ length: WIDTH }, () => Array.from({ length: HEIGHT }));
  for(let x = 0; x < WIDTH; x++) {
    for( let y = 0; y < HEIGHT; y++) {
      const dataEntry = data.find(item => item.x === x && item.y == y);
      emptyField[x][y] = dataEntry ? dataEntry.label : field[x][y];
    }
  }
  return emptyField;
}
const getInitialData = (rawData, WIDTH, HEIGHT) => {
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

module.exports = {
  sorter,
  getSize,
  printField,
  getFieldWithData,
  getInitialData,
}