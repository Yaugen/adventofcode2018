const fs = require('fs');

const input = fs.readFileSync('./10_0_input.txt', 'utf8');
const points = input.split('\n').map(line => {
  const match = line.match(/position=<(.+),(.+)> velocity=<(.+),(.+)>/)
  const [, x, y, xVel, yVel] = match
  return {
     x: Number(x),
     y: Number(y),
     xVel: Number(xVel),
     yVel: Number(yVel),
  };
})
const tick = points => {
  points.forEach(point => {
    point.x += point.xVel;
    point.y += point.yVel;
  });
}
const getSquareSize = points => {
  const xs = points.map(point => point.x);
  const ys = points.map(point => point.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  return { xMin, xMax, yMin, yMax };
}

const print = (points, xMin, yMin) => {
  const field = Array.from({ length: 100 }, () => Array.from({ length: 50 }, () => '.'));
  
  points.forEach(point => {
    field[point.x - xMin][point.y - yMin] = '#';
  })
  for(let i = 0; i< field[0].length; i+= 1) {
    console.log(field.map(col => col[i]).join(''));
  }
}

const simulate = () => {
  let done = true;
  let seconds = 1;
  do {
    tick(points);
    const { xMin, xMax, yMin, yMax } = getSquareSize(points);
    if (xMax - xMin <= 100 && yMax - yMin <= 100) {
      console.log(seconds);
      print(points, xMin, yMin);
    }
    seconds += 1;
  } while (done);
}

simulate();
console.log(points);



