import { field, step } from './17_0.js'
const counterEl = document.getElementById('counter');
const print = (curField, ctx, canvas) => {
  let counter = -3;
  let staleCounter = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeRect(0, 0, curField.length+3, curField[0].length+2);

  for(let i = 0; i < curField.length; i++) {
    for(let j = 0; j < curField[i].length; j++) {
      switch(curField[i][j]) {
        case '#':
          ctx.fillStyle = 'green';
          ctx.fillRect(i+1, j+1, 1, 1);
          break;
        case '|':
          ctx.fillStyle = 'blue';
          ctx.fillRect(i+1, j+1, 1, 1);
          counter += 1;
          break;
        case '~':
          ctx.fillStyle = 'red';
          ctx.fillRect(i+1, j+1, 1, 1);
          counter += 1;
          staleCounter += 1;
          break;
      }
    }
  }
  ctx.fillStyle = 'black';
  counterEl.innerHTML = `${counter},${staleCounter}`
}


const canvas = document.getElementById('canvas');
canvas.width = field.length + 3;
canvas.height = field[0].length + 2;
const ctx = canvas.getContext("2d");

let curField = field;
let interval;
const start = () => {
  interval = setInterval(() => {
    curField = step(curField);
    print(curField, ctx, canvas);
  }, 1)
}
window.addEventListener('load', () => {
  ctx.imageSmoothingEnabled = false;
  print(curField, ctx, canvas);
  start();
})
document.getElementById('pause').addEventListener('click', () => {
  clearInterval(interval);
})
document.getElementById('start').addEventListener('click', start)

