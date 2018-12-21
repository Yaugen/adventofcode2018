const fs = require('fs');
const { Device } = require('./19_0');

const inputRaw = fs.readFileSync('./19_0_input.txt', 'utf8');
const code = inputRaw.split('\r\n');

// const device = new Device(code);
// device.run();
// console.log(device.regs);


const device1 = new Device(code, [1, 0, 0, 0, 0, 0]);
device1.run();
console.log(device1.regs);
