const fs = require('fs');
const readline = require('readline');

const { getInitialData, getFieldWithData, printField, sorter, getNeighbours, getFieldWithDistances, getTarget, getPath } = require('./15_0');

const rawData = fs.readFileSync('./15_0_input.txt', 'utf8');
const { units, emptyField } = getInitialData(rawData);
const VERBOSE = false;


const isInAttackMode = (field, unit, units) => {
  const foes = getNeighbours(field, unit)
    .filter(neighbour => (unit.v === 'G' && neighbour.v === 'E') || (unit.v === 'E' && neighbour.v === 'G'))
    .map(cell => units.find(u => u.x === cell.x && u.y === cell.y));
  const minHp = foes.reduce((minHp, foe) => Math.min(minHp, foe.hp), 200);
  const minHpFoes = foes.filter(foe => foe.hp === minHp);

  return minHpFoes.length ? minHpFoes[0] : false;
}

const makeAttack = (unit, units) => {
  const fieldWithUnits = getFieldWithData(emptyField, units);
  const attackTarget = isInAttackMode(fieldWithUnits, unit, units);

  if(!attackTarget) {
    return false;
  }

  if(VERBOSE) {
    console.log('unit', unit, 'attack', attackTarget)
  }
  attackTarget.hp -= unit.dmg;
  if(attackTarget.hp < 0 && units.indexOf(attackTarget) >= 0) {
    units.splice(units.indexOf(attackTarget), 1);
  }
  unit.state = 'attack';
  return true;
}

const makeMove = (unit, units) => {
  const fieldWithUnits = getFieldWithData(emptyField, units);
  const fieldWithDistances = getFieldWithDistances(fieldWithUnits, unit);
  // printField(fieldWithDistances);
  const foeUnits = unit.v === 'G'
    ? units.filter(u => u.v === 'E')
    : units.filter(u => u.v === 'G');
  const target = getTarget(fieldWithDistances, foeUnits)

  if (!target) {
    return false;
  }

  const movePath = getPath(fieldWithDistances, unit, target.isReachable);
  if (VERBOSE) {
    console.log('unit', unit, 'move', movePath[0]);
  }
  unit.x = movePath[0].x;
  unit.y = movePath[0].y;
  unit.state = 'move';
  return true;
}

const step = (unit, units) => {
  if(unit.hp <= 0) {
    return;
  }
  if (!makeAttack(unit, units)) {
    if(makeMove(unit, units)) {
      makeAttack(unit, units);
    } else {
      unit.state = 'idle';
      if(VERBOSE) {
        console.log('unit', unit, 'idle')
      }
    }
  }
}

const round = (units) => {
  units.sort(sorter);
  units.slice().forEach(unit => step(unit, units))
  const fieldWithUnits = getFieldWithData(emptyField, units);
  if(VERBOSE) {
    printField(fieldWithUnits);
  }
}

const simulate = (units) => {
  let roundCounter = 1;

  while(!units.every(unit => unit.state === 'idle')) {
    console.log(roundCounter, 'elfs:', units.filter(u => u.v === 'E').length, 'goblins:', units.filter(u => u.v === 'G').length);
    roundCounter += 1;
    round(units);
  }
  const allHp = units.reduce((acc, unit) => acc + unit.hp, 0)
  console.log(roundCounter-3, allHp, (roundCounter-3)*allHp );
}

const part2 = () => {
  const initialUnits = JSON.parse(JSON.stringify(units));
  const intitalElfsCount = initialUnits.filter(u => u.v === 'E').length;
  let str = 4;

  let currentElfCount;
  do {
    const currentUnits = JSON.parse(JSON.stringify(initialUnits));
    currentUnits.forEach(u => {
      if(u.v === 'E') {
        u.dmg = str;
      }
    })
    console.log('--------------------------------------', str)
    simulate(currentUnits);
    currentElfCount = currentUnits.filter(u => u.v === 'E').length;
    str += 1;
  } while(currentElfCount !== intitalElfsCount)

}

// simulate(units);
part2();


// rl.on('line', () => {
//   console.log('ROUND', roundCounter);
//   roundCounter += 1;
//   round();
//   rl.prompt();
// })


