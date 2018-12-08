const assert = require('assert');

const {
  parseInputLine,
  findMaxRightAndBottom,
  make2DArray,
  claimAllAreas,
  countOverlaps,
  findNotOverlapped,
} = require('./3_0');

assert.deepStrictEqual(
  parseInputLine("#1307 @ 42,472: 13x14"), {
    id: 1307,
    left: 42,
    top: 472,
    right: 55,
    bottom: 486,
    width: 13,
    height: 14
  });

assert.deepStrictEqual(findMaxRightAndBottom([
  { right: 5, bottom: 7 },
  { right: 7, bottom: 5 },
  { right: 7, bottom: 7 },
]), { maxRight: 7, maxBottom: 7 });

assert.deepStrictEqual(make2DArray(2, 3), [
  [0, 0, 0],
  [0, 0, 0]
])

assert.deepStrictEqual(claimAllAreas([
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
], [
  { id: 1, left: 1, top: 3, right: 5, bottom: 7, width: 4, height: 4 },
  { id: 2, left: 3, top: 1, right: 7, bottom: 5, width: 4, height: 4 },
  { id: 3, left: 5, top: 5, right: 7, bottom: 7, width: 2, height: 2 },
]), [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 2, 2, 1, 1],
  [0, 1, 1, 2, 2, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
])

assert.strictEqual(countOverlaps([
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 2, 2, 1, 1],
  [0, 1, 1, 2, 2, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
]), 4);

assert.deepStrictEqual(findNotOverlapped([
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 2, 2, 1, 1],
  [0, 1, 1, 2, 2, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1],
], [
  { id: 1, left: 1, top: 3, right: 5, bottom: 7, width: 4, height: 4 },
  { id: 2, left: 3, top: 1, right: 7, bottom: 5, width: 4, height: 4 },
  { id: 3, left: 5, top: 5, right: 7, bottom: 7, width: 2, height: 2 },
]), { id: 3, left: 5, top: 5, right: 7, bottom: 7, width: 2, height: 2 });