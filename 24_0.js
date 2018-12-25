// 2374 units each with 41150 hit points (immune to bludgeoning, slashing, radiation; weak to cold) with an attack that does 34 bludgeoning damage at initiative 6
const parseWeaks = weaks => {
  const res = { weak: [], immune: [] }; 
  if(!weaks) {
    return res;
  }
  weaks.slice(1, -2).split('; ').forEach(group => {
    const [groupName, itemsRaw] = group.split(' to ');
    res[groupName] = itemsRaw.split(', ');
  })
  return res;
}

const parseArmy = (name, army) => army.split('\r\n').slice(1).map(group => {
  const [, units, unitHp, weaks, dmg, attackType, initiative] =
    group.match(/(\d+) units each with (\d+) hit points (\(?.*\)?)\s?with an attack that does (\d+)\s(\w+) damage at initiative (\d+)/);
  
  return {
    armyName: name,
    units: Number(units),
    unitHp: Number(unitHp),
    dmg: Number(dmg),
    attackType,
    initiative: Number(initiative),
    ...parseWeaks(weaks),
  }
});


const parse = (raw) => {
  const [immune, infection] = raw.split('\r\n\r\n');
  return {
    immune: parseArmy('immune', immune),
    infection: parseArmy('infection', infection),
  }
}

module.exports = {
  parse,
}