const fs = require('fs');
const fileData = fs.readFileSync('./18_0_input.txt', 'utf8');
const initial = fileData.split('\r\n').map(line => line.split(''));

const make2DArray = (width, height) => {
  return Array.from({ length: width }, () => (
    Array.from({ length: height }, () => '.')
  ))
};
const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
const printField = (f) => {
  const field = transpose(f);
  for(let y = 0; y < field.length; y += 1) {
    const line = [];
    for(let x = 0; x < field[0].length; x += 1) {
      const cell = field[x][y];
      line.push(cell);
    }
    console.log(line.join(''));
  }
  console.log('');
}
const getNeighbourCounters = (field, i, j) => {
  return [
    field[i][j-1],
    field[i][j+1],
    field[i+1] && field[i+1][j-1],
    field[i+1] && field[i+1][j],
    field[i+1] && field[i+1][j+1],
    field[i-1] && field[i-1][j],
    field[i-1] && field[i-1][j-1],
    field[i-1] && field[i-1][j+1],
  ].filter(Boolean).reduce((counter, item) => {
    switch(item) {
      case '.': counter.open += 1; break;
      case '|': counter.trees += 1; break;
      case '#': counter.yard += 1; break;
    }
    return counter;
  }, { open: 0, trees: 0, yard: 0 });
} 

const step = field => {
  const width = field.length;
  const height = field[0].length;
  const newField = make2DArray(width, height);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const counters = getNeighbourCounters(field, i, j);
      if (field[i][j] === '.') {
        newField[i][j] = counters.trees >= 3 ? '|' : field[i][j]; 
      } else if (field[i][j] === '|') {
        newField[i][j] = counters.yard >= 3 ? '#' : field[i][j]; 
      } else if (field[i][j] === '#') {
        newField[i][j] = counters.yard >= 1 && counters.trees >= 1 ? '#' : '.'; 
      }
    }
  }
  return newField;
}

const count = field => {
  const counter = { open: 0, trees: 0, yard: 0 }
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      switch(field[i][j]) {
        case '.': counter.open += 1; break;
        case '|': counter.trees += 1; break;
        case '#': counter.yard += 1; break;
      }
    }
  }
  return counter;
}

let curr = initial;
printField(initial);
const s = new Set();
for(let i = 0; i< 1000; i++) {
  curr = step(curr);
  // printField(curr);
  const itemCount = count(curr);
  const str = `${JSON.stringify(itemCount)} ${itemCount.trees*itemCount.yard}`;
  console.log(i, str);
  // if(s.has(str)) {
  //   break;
  // } else {
  //   s.add(str);
  // }
}
const itemCount = count(curr);
console.log(itemCount, itemCount.trees*itemCount.yard);