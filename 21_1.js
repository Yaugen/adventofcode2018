const fs = require('fs');
const { Device } = require('./21_0');

const inputRaw = fs.readFileSync('./21_0_input.txt', 'utf8');
const code = inputRaw.split('\r\n');

// const device = new Device(code);
// device.run();
// console.log(device.regs);


const device1 = new Device(code, [0, 0, 0, 0, 0, 0]);
console.time('timer')
device1.run();
console.timeEnd('timer')
