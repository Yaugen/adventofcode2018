const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./1_1_input.json', 'utf8'));
let freq = 0;
let iter = 0;
const freqHist = new Set();

while(true) {
  freq += data[iter];
  if(freqHist.has(freq)) {
    break;
  }
  freqHist.add(freq);
  iter = (iter + 1) % data.length;
}
console.log(iter,freq);