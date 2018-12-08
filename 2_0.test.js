const assert = require('assert');

const {
  getCharCounters,
  getTwoesAndThreesCounters,
  processTwoesAndThrees,
  compareStrWithMisses,
  findAlmostDuplicates,
} = require('./2_0');

assert.deepStrictEqual(getCharCounters('abcdef'), {
  a: 1,
  b: 1,
  c: 1,
  d: 1,
  e: 1,
  f: 1,
});
assert.deepStrictEqual(getCharCounters('bababc'), {
  a: 2,
  b: 3,
  c: 1,
});
assert.deepStrictEqual(getCharCounters('abbcde'), {
  a: 1,
  b: 2,
  c: 1,
  d: 1,
  e: 1,
});

assert.deepStrictEqual(getTwoesAndThreesCounters('abcdef'), [0, 0]);
assert.deepStrictEqual(getTwoesAndThreesCounters('bababc'), [1, 1]);
assert.deepStrictEqual(getTwoesAndThreesCounters('abbcde'), [1, 0]);
assert.deepStrictEqual(getTwoesAndThreesCounters('abcccd'), [0, 1]);
assert.deepStrictEqual(getTwoesAndThreesCounters('aabcdd'), [1, 0]);
assert.deepStrictEqual(getTwoesAndThreesCounters('abcdee'), [1, 0]);
assert.deepStrictEqual(getTwoesAndThreesCounters('ababab'), [0, 1]);

const data = [
  'abcdef',
  'bababc',
  'abbcde',
  'abcccd',
  'aabcdd',
  'abcdee',
  'ababab',
];

assert.deepStrictEqual(processTwoesAndThrees(data), [4, 3]);

assert(!compareStrWithMisses('abcde', 'axcye'));
assert(compareStrWithMisses('fghij', 'fguij'));


assert.deepStrictEqual(findAlmostDuplicates([
  'abcde',
  'fghij',
  'klmno',
  'pqrst',
  'fguij',
  'axcye',
  'wvxyz',
]
), ['fghij', 'fguij']);