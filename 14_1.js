const getDigits = n => n.toString().split('').map(Number);
const digitsMap = Array.from({ length: 19}, () => 0)
  .reduce((acc, item, index) => ({...acc, [index]: getDigits(index)}), {});
console.log(digitsMap);
const print = (board, curA, curB) => {
  const str = board.map((item, index) => {
    if(index === curA) {
      return `(${item})`
    } else if (index === curB) {
      return `[${item}]`
    }
    return ` ${item} `;
  }).join('');
  console.log(str);
}
const generate = (itemCount) => {
  const board = [3, 7];
  let curA = 0;
  let curB = 1;
  
  while(board.length < itemCount + 10) {
    const sum = board[curA] + board[curB];
    board.push(...getDigits(sum));

    curA = (curA + board[curA] + 1) % board.length;
    curB = (curB + board[curB] + 1) % board.length;
  }

  return board.slice(board.length-10).join('');
}


const generate2 = (seqToFind) => {
  const board = [3, 7];
  let curA = 0;
  let curB = 1;

  // const test = 

  while(!board.slice(-(seqToFind.length+5)).join('').includes(seqToFind)) {
    const sum = board[curA] + board[curB];
    board.push(...digitsMap[sum]);

    curA = (curA + board[curA] + 1) % board.length;
    curB = (curB + board[curB] + 1) % board.length;
    // if(board.length % 10000 === 0) {
      // console.log(board.length)
    // }

  }

  return board.join('').indexOf(seqToFind);
}

const generate3 = (seqToFind) => {
  let board = '37';
  let curA = 0;
  let curB = 1;

  while(!board.endsWith(seqToFind)) {
    const a = Number(board[curA]);
    const b = Number(board[curB])
    const sum = a + b;
    board += sum;

    curA = (curA + a + 1) % board.length;
    curB = (curB + b + 1) % board.length;
    if(board.length % 100 === 0) {
      console.log(board.length)
    }
  }

  return board.join('').indexOf(seqToFind);
}

// console.log(generate(9) === '5158916779');
// console.log(generate(5) === '0124515891');
// console.log(generate(18) === '9251071085');
// console.log(generate(2018) === '5941429882');
// console.log(generate(580741));

console.time('first run');
console.log(generate2('51589'))
console.log(generate2('01245'))
console.log(generate2('92510'))
console.log(generate2('59414'))
console.timeEnd('first run')
console.log(generate2('580741'))

// console.time('second run');
// console.log(generate3('51589'))
// console.log(generate3('01245'))
// console.log(generate3('92510'))
// console.log(generate3('59414'))
// console.timeEnd('second run');
// console.log(generate3('580741'))



