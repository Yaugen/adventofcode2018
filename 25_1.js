const fs = require('fs');
const rawData = fs.readFileSync('./25_0_input.txt', 'utf8');

const points = rawData.split('\r\n').map(line => line.split(',').map(Number));
const getDist = (a,b) => a.reduce((d, coord, index) => d + Math.abs(coord - b[index]), 0); 

const canBeMerged = (groupA, groupB) => groupA.some(pointA => groupB.some(pointB => getDist(pointA, pointB) <= 3));

const getGroups = (points) => {
  const groups = [];

  points.forEach(point => {
    const suitableGroup = groups.find(group => group.some(p => getDist(point, p) <= 3));
    if(suitableGroup) {
      suitableGroup.push(point);
    } else {
      groups.push([point]);
    }
  });

  let groupsMerged;
  do {
    groupsMerged = false;

    for(let i = 0; i < groups.length; i++) {
      for(let j = i + 1; j < groups.length; j++) {
        if(canBeMerged(groups[i], groups[j])) {
          groups.splice(i, 1, [...groups[i], ...groups[j]]);
          groups.splice(j, 1);
          groupsMerged = true;
        }
      }
    }
  } while(groupsMerged);

  return groups;
}

console.log(getGroups(points).length);
