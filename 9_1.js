const { List, listSolution } = require('./9_0');

const TURNS = 7082500;
const PLAYER_COUNT = 428;

const printField = (field, selectedMarbleIndex, currentPlayer) => {
  const line = field.reduce((acc, marble, index) => {
    const item = index === selectedMarbleIndex ? `(${marble})` : marble;
    return acc ? `${acc}, ${item}` : `${item}`;
  }, '')
  console.log(currentPlayer + 1, line);
}

const generate = (verbose = false) => {
  let field = [0];
  const players = Array.from({ length: PLAYER_COUNT }, () => 0);
  let selectedMarble = 0;
  let selectedMarbleIndex = 0;
  let turn = 0;
  let currentPlayer = 0;

  if (verbose) {
    printField(field, selectedMarbleIndex, currentPlayer);
  }

  while(turn < TURNS) {
    selectedMarble += 1;
    if (selectedMarble % 23 === 0) {
      let marbleToRemoveIndex = selectedMarbleIndex - 7;
      marbleToRemoveIndex = marbleToRemoveIndex < 0 ? field.length - Math.abs(marbleToRemoveIndex) : marbleToRemoveIndex;
      
      players[currentPlayer] += selectedMarble;
      players[currentPlayer] += field[marbleToRemoveIndex];

      field = field.filter((item, index) => index !== marbleToRemoveIndex);
      selectedMarbleIndex = marbleToRemoveIndex;
    } else {
      selectedMarbleIndex += 2;
      selectedMarbleIndex = selectedMarbleIndex <= field.length ? selectedMarbleIndex : selectedMarbleIndex - field.length;
      field = [...field.slice(0, selectedMarbleIndex), selectedMarble, ...field.slice(selectedMarbleIndex)];
    }
    
    if (verbose) {
      printField(field, selectedMarbleIndex, currentPlayer);
    }

    currentPlayer = (currentPlayer + 1) % PLAYER_COUNT;
    turn += 1;
  }

  return Math.max(...players);
}


const generateWithList = (verbose = false) => {
  let field = new List();
  field.insertOnIndex(0, 0);
  const players = Array.from({ length: PLAYER_COUNT }, () => 0);
  let selectedMarble = 0;
  let selectedMarbleIndex = 0;
  let turn = 0;
  let currentPlayer = 0;

  if (verbose) {
    printField(field.values(), selectedMarbleIndex, currentPlayer);
  }

  while(turn < TURNS) {
    selectedMarble += 1;
    if (selectedMarble % 23 === 0) {
      let marbleToRemoveIndex = selectedMarbleIndex - 7;
      marbleToRemoveIndex = marbleToRemoveIndex < 0 ? field.length - Math.abs(marbleToRemoveIndex) : marbleToRemoveIndex;
      
      players[currentPlayer] += selectedMarble;
      players[currentPlayer] += field.findByIndex(marbleToRemoveIndex).value;

      field.removeOnIndex(marbleToRemoveIndex);

      selectedMarbleIndex = marbleToRemoveIndex;
    } else {
      selectedMarbleIndex += 2;
      selectedMarbleIndex = selectedMarbleIndex <= field.length ? selectedMarbleIndex : selectedMarbleIndex - field.length;
      field.insertOnIndex(selectedMarbleIndex, selectedMarble);
    }
    
    if (verbose) {
      printField(field.values(), selectedMarbleIndex, currentPlayer);
    }

    currentPlayer = (currentPlayer + 1) % PLAYER_COUNT;
    turn += 1;
  }

  return Math.max(...players);
}

// const start1 = Date.now();
// console.log(generate())
// console.log(Date.now() - start1);

// const start2 = Date.now();
// console.log(generateWithList())
// console.log(Date.now() - start2);


console.log(listSolution('428 players; last marble is worth 70825 points'))
console.log(listSolution('428 players; last marble is worth 7082500 points'))
