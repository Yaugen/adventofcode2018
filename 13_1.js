const fs = require('fs');

const rawData = fs.readFileSync('./13_0_input.txt', 'utf8');
const WIDTH = rawData.split('\n')[0].length;
const HEIGHT = rawData.split('\n').length;
const rawInput = Array.from({ length: WIDTH}, () => Array.from({ length: HEIGHT }));
rawData.split('\n').forEach((line, yIndex) => (
  line.split('').forEach((cell, xIndex) => {
    rawInput[xIndex][yIndex] = cell;
  })
));

const dirToCoordMap = {
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0],
  '^': [0, -1],
};

const newDirMap = {
  '>/': '^', '>\\': 'v', '>+0': '^', '>+2': 'v',
  'v/': '<', 'v\\': '>', 'v+0': '>', 'v+2': '<',
  '</': 'v', '<\\': '^', '<+0': 'v', '<+2': '^',
  '^/': '>', '^\\': '<', '^+0': '<', '^+2': '>',
};

const printField = (field, carts = [], collision) => {
  for(let y = 0; y < HEIGHT; y += 1) {
    const line = [];
    for(let x = 0; x < WIDTH; x += 1) {
      const cart = carts.find(cart => cart.x === x && cart.y === y);
      let cell = cart ? cart.dir : field[x][y];
      if (collision) {
        cell = x === collision.x && y === collision.y ? 'X' : cell;
      } 
      line.push(cell);
    }
    console.log(line.join(''));
  }
}

const getCartsAndRestoreInput = field => {
  const carts = [];
  for (let x = 0; x < WIDTH; x += 1) {
    for (let y = 0; y < HEIGHT; y += 1) {
      if (['>', '<', '^', 'v'].includes(field[x][y])) {
        const cart = { x, y, dir: field[x][y], nextTurn: 0 };
        if (cart.dir === '>' || cart.dir === '<') {
          field[x][y] = '-';
        } else if (cart.dir === '^' || cart.dir === 'v') {
          field[x][y] = '|';
        }
        carts.push(cart);
      }
    }
  }
  return carts;
}

const getNewCartDir = (cart, nextCell) => {
  let newDir;
  if (nextCell === '+') {
    newDir = newDirMap[`${cart.dir}${nextCell}${cart.nextTurn}`];
    cart.nextTurn = (cart.nextTurn + 1) % 3;
  } else {
    newDir = newDirMap[`${cart.dir}${nextCell}`];
  }
  cart.dir = newDir ? newDir : cart.dir;
}

const carts = getCartsAndRestoreInput(rawInput);

const generate = (field, steps, verbose = false) => {
  if (verbose) {
    printField(field, carts);
  }
  for (let step = 0; step < steps; step++) {
    for(let i = 0; i < carts.length; i++ ) {
      const cart = carts[i];
      const [dx, dy] = dirToCoordMap[cart.dir];
      cart.x += dx;
      cart.y += dy;
      getNewCartDir(cart, field[cart.x][cart.y]);
      const collision = carts.find(otherCart => otherCart !== cart && otherCart.x === cart.x && otherCart.y === cart.y);
      if(collision) {
        printField(field, carts, collision);
        console.log(collision);
        return;
      }
    }
    carts.sort((cartA, cartB) => {
      if (cartA.y === cartB.y) {
        return cartA.x - cartB.x
      }
      return cartA.y - cartB.y;
    })
    if (verbose) {
      printField(field, carts);
    }
  }
}

generate(rawInput, 10000);