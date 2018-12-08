const parseLogFile = file => {
  const guards = {};
  let currentGuard;

  file.split('\r\n').sort().forEach(line => {
    const [, minute, message] = line.match(/:(\d{2})] (.*)/);

    switch (message) {
      case 'falls asleep':
        currentGuard.lastSleepStart = Number(minute);
        break;
      case 'wakes up':
        for (let i = currentGuard.lastSleepStart; i < Number(minute); i++) {
          currentGuard.timespan[i] += 1;
        }
        break;
      default:
        const [, guardId] = message.match(/#(\d+)/);
        if (!guards[guardId]) {
          guards[guardId] = {
            guardId,
            timespan: Array.from({
              length: 60
            }, item => 0)
          };
        }
        currentGuard = guards[guardId];
        break;
    }
  });

  return Object.keys(guards).map(key => guards[key]);
}

const sum = arr => arr.reduce((acc, item) => acc + item, 0);
const maxSleptMinute = timespan => timespan.reduce((acc, sleptTimes, minute) => (
  sleptTimes > acc.sleptTimes ? { sleptTimes, minute } : acc
), { sleptTimes: 0, minute: 0 })

const addAdditionalData = (guards) => guards.map(guard => {
  const { minute, sleptTimes } = maxSleptMinute(guard.timespan);
  return ({
    ...guard,
    sleptTotal: sum(guard.timespan),
    maxSleptOnMinute: minute,
    maxSleptTimes: sleptTimes
  });
});

module.exports = {
  getGuardsData: file => addAdditionalData(parseLogFile(file))
};
