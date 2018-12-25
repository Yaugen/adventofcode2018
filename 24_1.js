const fs = require('fs');
const { parse } = require('./24_0');

const input = fs.readFileSync('./24_0_input.txt', 'utf8');
const getPossibleDamage = (a, b) => {
  const dmg = a.units * a.dmg;
  if (b.immune.includes(a.attackType)) {
    return 0;
  }
  if (b.weak.includes(a.attackType)) {
    return dmg * 2;
  }
  return dmg;
}
const targetSelectionOrderSorter = (a,b) => {
  const aEffectivePower = a.units * a.dmg;
  const bEffectivePower = b.units * b.dmg;
  if(aEffectivePower === bEffectivePower) {
    return b.initiative - a.initiative;
  } 
  return bEffectivePower - aEffectivePower;
}
const targetSelectionSorter = (attackingGroup) => (a,b) => {
  const aPossibleDamage = getPossibleDamage(attackingGroup, a);
  const bPossibleDamage = getPossibleDamage(attackingGroup, b);
  if (aPossibleDamage === bPossibleDamage) {
    const aEffectivePower = a.units * a.dmg;
    const bEffectivePower = b.units * b.dmg;
    if(aEffectivePower === bEffectivePower) {
      return b.initiative - a.initiative;
    }
    return bEffectivePower - aEffectivePower;
  }
  return bPossibleDamage - aPossibleDamage;
} 
const getTarget = (attackingGroup, defendingArmy) => {
  const targets = defendingArmy
    .slice()
    .filter(defending => getPossibleDamage(attackingGroup, defending))
    .sort(targetSelectionSorter(attackingGroup));
  return targets;
}

const selectTargets = (attackingArmy, defendingArmy, targetPool) => {
  attackingArmy.slice().sort(targetSelectionOrderSorter).forEach(attackingGroup => {
    const targets = getTarget(attackingGroup, targetPool);
    targets.forEach(target => {
      // console.log(
      //   attackingGroup.armyName,
      //   attackingArmy.indexOf(attackingGroup),
      //   target.armyName,
      //   defendingArmy.indexOf(target),
      //   getPossibleDamage(attackingGroup, target));
    });
    const target = targets[0];
    if(targets.length) {
      attackingGroup.target = target;
      targetPool.splice(targetPool.indexOf(target), 1);
    } else {
      attackingGroup.target = null;
    }
  });
}
const attackOrderSorter = (a,b) => b.initiative - a.initiative;

const attack = (immune, infection) => {
  const attackOrder = [...immune, ...infection].sort(attackOrderSorter);
  attackOrder.forEach(group => {
    const isImmune = immune.includes(group);

    if(group.target) {
      const damage = getPossibleDamage(group, group.target);
      let kills = Math.floor(damage / group.target.unitHp);
      kills = kills >= group.target.units ? group.target.units : kills;
      // console.log(
      //   group.armyName,
      //   isImmune ? immune.indexOf(group) : infection.indexOf(group),
      //   group.target.armyName,
      //   isImmune ? infection.indexOf(group.target) : immune.indexOf(group.target),
      //   'deals', damage,
      //   'kills', kills, damage / group.target.unitHp);

      if(kills >= group.target.units) {
        if(isImmune) {
          infection.splice(infection.indexOf(group.target), 1);
        } else {
          immune.splice(immune.indexOf(group.target), 1);
        }
      } else {
        group.target.units -= kills;
      }
    }
  })
}

const round = (immune, infection) => {
  const immunePool = immune.slice();
  const infectionPool = infection.slice();

  selectTargets(infection, immune, immunePool);
  selectTargets(immune, infection, infectionPool);

  attack(immune, infection);
}
const getUnitSum = (army) => army.reduce((sum, group) => sum + group.units, 0);

const battle = (boost = 0) => {
  const { immune, infection } = parse(input);
  immune.forEach(group => {
    group.dmg += boost;
  });

  while(immune.length && infection.length) {
    round(immune, infection);
  }
  console.log(boost, getUnitSum(immune), getUnitSum(infection));
  return { immune, infection }; 
}

const simulate = () => {
  for(let boost = 70; true; boost++) {
    const { immune, infection } = battle(boost);
    if(immune.length>0) {
      console.log(boost, getUnitSum(immune))
      break;
    }
  }
}

// battle(0);
simulate();