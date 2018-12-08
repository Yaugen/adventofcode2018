const fs = require('fs');
const {
  getGuardsData
} = require('./4_0');

const file = fs.readFileSync('./4_0_input.txt', 'utf8');
const guards = getGuardsData(file);

const maxSleptTimesGuard = Object.keys(guards).reduce((maxSleptGuard, guardId) => {
  const guard = guards[guardId];
  if (guard.maxSleptTimes > maxSleptGuard.maxSleptTimes) {
    return guard;
  }
  return maxSleptGuard;
}, {
  maxSleptTimes: 0
});

console.log(maxSleptTimesGuard.guardId * maxSleptTimesGuard.maxSleptOnMinute)