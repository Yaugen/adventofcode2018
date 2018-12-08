const isReact = (a = '', b = '') => (Math.abs(a.charCodeAt() - b.charCodeAt()) === 32)

const reducePolymer = (polymer) => {
  let changed = false;
  const reducedPolymer = polymer.reduce((acc, item) => {
    const lastIndex = acc.length - 1;
    const lastItem = acc[lastIndex];

    if(!acc.length) {
      acc.push(item);
    } else if(isReact(item, lastItem)) {
      changed = true;
      acc.pop();
    } else {
      acc.push(item);
    }
    return acc; 

  }, [])

  if (changed) {
    return reducePolymer(reducedPolymer);
  }
  return reducedPolymer;
}

module.exports = { reducePolymer };
