const initialStateRaw = '..#..###...#####.#.#...####.#..####..###.##.#.#.##.#....#....#.####...#....###.###..##.#....#######';
const rulesRaw = [
  '..### => .',
  '.##.# => #',
  '#..#. => .',
  '#.#.# => #',
  '###.. => #',
  '.#..# => .',
  '##..# => #',
  '.###. => #',
  '..#.. => .',
  '..... => .',
  '##### => .',
  '.#... => #',
  '...#. => #',
  '#...# => #',
  '####. => .',
  '.#### => .',
  '##.## => #',
  '...## => .',
  '..##. => .',
  '#.##. => .',
  '#.... => .',
  '.#.#. => .',
  '..#.# => #',
  '#.#.. => #',
  '##... => #',
  '##.#. => .',
  '#..## => .',
  '.##.. => .',
  '#.### => .',
  '....# => .',
  '.#.## => #',
  '###.# => #',
]

module.exports = {
  initialStateRaw,
  rulesRaw,
}