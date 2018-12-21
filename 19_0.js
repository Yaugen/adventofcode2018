class Device {
  constructor(code, regs = [0, 0, 0, 0, 0, 0]) {
    this.opers = {

    };
    this.code = this.parseCode(code);
    this.regs = regs;
  }
  parseCode(code) {
    return code.map(line => {
      const match = line.match(/(\w+) (\d+)\s?(\d*)\s?(\d*)/);
      if (match) {
        const [, oper, arg0, arg1, arg2] = match;
        if(oper === 'ip') {
          this.ip(Number(arg0));
          return null;
        }
        return { oper, args: [arg0, arg1, arg2].filter(Boolean).map(Number) };
      }
      return null;
    }).filter(Boolean);
  }
  setReg(regPtr, value) {
    this.regs[regPtr] = value;
  }
  run() {
    this.currentInstr = 0;
    while(this.currentInstr < this.code.length) {
      const prevRegs = this.regs.slice();
      const ip = this.currentInstr;
      const { oper, args } = this.code[this.currentInstr];
      this.setReg(this.instrPtr, this.currentInstr);

      this[oper](...args);

      this.currentInstr = this.regs[this.instrPtr];
      this.currentInstr += 1;
      if(this.regs[2] % 100000 === 0) {
        console.log(ip, prevRegs, oper, args, this.regs)
      }
    }
  }


  ip(a) {
    this.instrPtr = a;
  }
  addr(a, b, c) { this.setReg(c, this.regs[a] + this.regs[b]); }
  addi(a, b, c) { this.setReg(c, this.regs[a] + b); }
  mulr(a, b, c) { this.setReg(c, this.regs[a] * this.regs[b]); }
  muli(a, b, c) { this.setReg(c, this.regs[a] * b); }
  banr(a, b, c) { this.setReg(c, this.regs[a] & this.regs[b]); } 
  bani(a, b, c) { this.setReg(c, this.regs[a] & b); }
  borr(a, b, c) { this.setReg(c, this.regs[a] | this.regs[b]); } 
  bori(a, b, c) { this.setReg(c, this.regs[a] | b); }
  setr(a, b, c) { this.setReg(c, this.regs[a]); }
  seti(a, b, c) { this.setReg(c, a); }
  gtir(a, b, c) { this.setReg(c, a > this.regs[b] ? 1 : 0); }
  gtri(a, b, c) { this.setReg(c, this.regs[a] > b ? 1 : 0); }
  gtrr(a, b, c) { this.setReg(c, this.regs[a] > this.regs[b] ? 1 : 0); } 
  eqir(a, b, c) { this.setReg(c, a === this.regs[b] ? 1 : 0); }
  eqri(a, b, c) { this.setReg(c, this.regs[a] === b ? 1 : 0); }
  eqrr(a, b, c) { this.setReg(c, this.regs[a] === this.regs[b] ? 1 : 0); }

  
}

module.exports = {
  Device,
}