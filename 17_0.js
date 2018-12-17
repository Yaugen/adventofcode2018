import fileData from './17_0_input.js'

const objectData = fileData.map(line => {
  const [, dimA, valA, dimB, valBFrom, valBTo] = line.match(/(.)=(\d+), (.)=(\d+)\.\.(\d+)/);
  return { [dimA]: Number(valA), [dimB]: [Number(valBFrom), Number(valBTo)]};
})
const { xMax, yMax, xMin, yMin } = objectData.reduce(({ xMax, yMax, xMin, yMin }, item) => {
  const x = Array.isArray(item.x) ? item.x[1] : item.x;
  const y = Array.isArray(item.y) ? item.y[1] : item.y;
  return { xMax: Math.max(x, xMax), yMax: Math.max(y, yMax), xMin: Math.min(xMin, x), yMin: Math.min(yMin, y) };
}, { xMax: 0, yMax: 0, xMin: Number.MAX_VALUE, yMin: Number.MAX_VALUE });
console.log(xMax, yMax, xMin, yMin);
const make2DArray = (width, height) => {
  return Array.from({ length: width }, () => (
    Array.from({ length: height }, () => '.')
  ))
};

const field = make2DArray(xMax - xMin + 2, yMax + 1);
objectData.forEach(({ x, y }) => {
  if(Array.isArray(x)) {
    const [ from, to ] = x;
    for(let i = from; i <= to; i++) {
      field[i-xMin+1][y] = '#';
    }
  } else {
    const [ from, to ] = y;
    for(let i = from; i <= to; i++) {
      field[x-xMin+1][i] = '#';
    }
  }
})

field[500-xMin+1][0] = '|';

const getNeighbours = (field, x, y) => {
  return {
    curr: { x, y, v: field[x][y] },
    top: { x, y: y-1, v: field[x] && field[x][y-1] },
    right: { x: x+1, y, v: field[x+1] && field[x+1][y] },
    left: { x: x-1, y, v: field[x-1] && field[x-1][y] },
    bottom: { x, y: y+1, v: field[x] && field[x][y+1] },
  };
}

const step = (field) => {
  for(let x = 0; x < field.length; x++) {
    for(let y = 0; y < field[0].length; y++) {
      if(field[x][y] !== '|') {
        continue;
      }
      const n = getNeighbours(field, x, y);
      if(n.bottom.v === '.') {
        field[x][y+1] = '|';
      } else if(n.bottom.v === '#' || n.bottom.v === '~') {
        // checkHorizon(field, x, y);


        for(let right = x + 1; right < field.length; right++) {
          const rn = getNeighbours(field, right, y);
          if(rn.curr.v === '.' && (rn.bottom.v === '#' || rn.bottom.v === '~')) {
            field[right][y] = '|';
          } else if (rn.curr.v === '#') {
            break;
          } else if (rn.bottom.v === '.' && rn.right.v !== '|') {
            field[right][y] = '|';
            break;
          } else {
            break;
          }
        }
        for(let left = x - 1; left >= 0; left--) {
          const ln = getNeighbours(field, left, y);
          if(ln.curr.v === '.' && (ln.bottom.v === '#' || ln.bottom.v === '~')) {
            field[left][y] = '|';
          } else if (ln.curr.v === '#') {
            break;
          } else if (ln.bottom.v === '.' && ln.left.v !== '|') {
            field[left][y] = '|';
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  for(let y = 0; y < field[0].length; y++) {
    const line = [];
    for(let x = 0; x < field.length; x++) {
      line.push(field[x][y]);
    }
    const str = line.join('');
    const match = str.match(/(#\|+#)/g);
    if(match) {
      const start = str.indexOf(match[0]);
      const end = start + match[0].length - 2;
      for(let i = start + 1; i <= end; i++) {
        field[i][y] = '~';
      }
    }
  }
  return field;
}

export {
  field,
  step
}