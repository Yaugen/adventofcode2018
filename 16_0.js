const fs = require('fs');
const readLine = require('readline');

const processLines = async (file) => new Promise((resolve) => {
  const fileStream = fs.createReadStream(file);
  const rl = readLine.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const firstPart = [];
  const secondPart = [];
  let isFirstPart = false;

  rl.on('line', line => {
    if (line.startsWith('Before')) {
      isFirstPart = true;
      const [, a, b, c, d] = line.match(/\[(\d+), (\d+), (\d+), (\d+)\]/);
      const obj = { before: [a, b, c, d].map(Number) };
      firstPart.push(obj);
    } else if (line.startsWith('After')) {
      isFirstPart = false;
      const [, a, b, c, d] = line.match(/\[(\d+), (\d+), (\d+), (\d+)\]/);
      firstPart[firstPart.length-1].after = [a, b, c, d].map(Number);
    } else if (line.match(/\d/)) {
      const [, a, b, c, d] = line.match(/(\d+) (\d+) (\d+) (\d+)/);
      const oper = [a, b, c, d].map(Number);
      if(isFirstPart) {
        firstPart[firstPart.length-1].oper = oper;
      } else {
        secondPart.push(oper);
      }
    }
  }).on('close', () => {
    resolve({ firstPart, secondPart })
  });
});

const compareArrays = (a, b) => a.every((item, index) => item === b[index]);

class Device {
  constructor() {
    this.opers = {
      addr: regs => (a, b, c) => { regs[c] = regs[a] + regs[b] },
      addi: regs => (a, b, c) => { regs[c] = regs[a] + b; },
      mulr: regs => (a, b, c) => { regs[c] = regs[a] * regs[b]; },
      muli: regs => (a, b, c) => { regs[c] = regs[a] * b; },
      banr: regs => (a, b, c) => { regs[c] = regs[a] & regs[b]; },
      bani: regs => (a, b, c) => { regs[c] = regs[a] & b; },
      borr: regs => (a, b, c) => { regs[c] = regs[a] | regs[b]; },
      bori: regs => (a, b, c) => { regs[c] = regs[a] | b; },
      setr: regs => (a, b, c) => { regs[c] = regs[a]; },
      seti: regs => (a, b, c) => { regs[c] = a; },
      gtir: regs => (a, b, c) => { regs[c] = a > regs[b] ? 1 : 0; },
      gtri: regs => (a, b, c) => { regs[c] = regs[a] > b ? 1 : 0; },
      gtrr: regs => (a, b, c) => { regs[c] = regs[a] > regs[b] ? 1 : 0; },
      eqir: regs => (a, b, c) => { regs[c] = a === regs[b] ? 1 : 0; },
      eqri: regs => (a, b, c) => { regs[c] = regs[a] === b ? 1 : 0; },
      eqrr: regs => (a, b, c) => { regs[c] = regs[a] === regs[b] ? 1 : 0; },
    };

    this.regs = [0, 0, 0, 0];
  }

  runOper(name, regs, args) {
    const currRegs = Array.from(regs);
    this.opers[name](currRegs)(...args);
    return currRegs;
  }

  runOperCodeInContext(oper) {
    const [operCode, ...operArgs] = oper;
    const operName = this.operCodeToNameMap[operCode];
    this.opers[operName](this.regs)(...operArgs);
  }

  getOperNames() {
    return Object.keys(this.opers);
  }

  train(data) {
    const operNames = this.getOperNames();
    const operCodeToNameMap = Array.from({ length: operNames.length }, () => 0)
      .reduce((map, item, index) => ({ ...map, [index]: new Set(operNames) }), {});
    
    data.forEach(({ before, after, oper }) => {
      const [operCode, ...operArgs] = oper;
      operNames.forEach(operName => {
        if (!compareArrays(after, this.runOper(operName, before, operArgs))) {
          operCodeToNameMap[operCode].delete(operName);
        }
      })
    });

    while(!Object.values(operCodeToNameMap).every(set => set.size === 1)) {
      Object.values(operCodeToNameMap)
        .filter(set => set.size === 1)
        .forEach(set => {
          const [oper] = Array.from(set);
          Object.values(operCodeToNameMap)
            .filter(set => set.size > 1)
            .forEach(set => set.delete(oper));
        });
    }

    this.operCodeToNameMap = Object.entries(operCodeToNameMap)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: Array.from(value)[0] }), {});
  }
}


module.exports = {
  processLines,
  compareArrays,
  Device,
}