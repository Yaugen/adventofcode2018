const getCharCounters = str =>
  str.split('')
  .reduce((counters, char) => {
    if (!counters[char]) {
      counters[char] = 0;
    }
    counters[char] += 1;
    return counters;
  }, {});

const getTwoesAndThreesCounters = str => Object.values(getCharCounters(str))
  .reduce(([twoes, threes], value) => {
    if (value === 2 && !twoes) {
      twoes += 1;
    } else if (value === 3 && !threes) {
      threes += 1;
    }
    return [twoes, threes];
  }, [0, 0]);

const processTwoesAndThrees = data => data
  .map(getTwoesAndThreesCounters)
  .reduce((acc, [twoes, threes]) => {
    acc[0] += twoes;
    acc[1] += threes;
    return acc;
  }, [0, 0]);

const compareStrWithMisses = (a, b, misses = 1) => {
  let triesLeft = misses;
  let iter = 0;
  while(iter < a.length && triesLeft >= 0) {
    if (a[iter] !== b[iter]) {
      triesLeft -= 1;
    }
    iter += 1;
  }
  return triesLeft >= 0;
}

const findAlmostDuplicates = (data) => {
  for(let i = 0; i< data.length; i += 1) {
    for (let j = i + 1; j < data.length; j += 1) {
      if (compareStrWithMisses(data[i], data[j])) {
        return [data[i], data[j]];
      }
    }
  }
}

module.exports = {
  getCharCounters,
  getTwoesAndThreesCounters,
  processTwoesAndThrees,
  compareStrWithMisses,
  findAlmostDuplicates,
}