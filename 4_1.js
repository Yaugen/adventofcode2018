const fs = require('fs');
const {
  getGuardsData
} = require('./4_0');

const file = fs.readFileSync('./4_0_input.txt', 'utf8');
const guards = getGuardsData(file);

const mostSleepyGuard = Object.keys(guards).reduce((maxSleptGuard, guardId) => {
  const guard = guards[guardId];
  if (guard.sleptTotal > maxSleptGuard.sleptTotal) {
    return guard;
  }
  return maxSleptGuard;
}, { sleptTotal: 0 });

console.log(mostSleepyGuard.guardId * mostSleepyGuard.maxSleptOnMinute);
