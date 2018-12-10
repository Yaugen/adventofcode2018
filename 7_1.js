const fs = require('fs');

const fileData = fs.readFileSync('./7_0_input.txt', 'utf8');
const parseInput = (data) => {
  const allNodes = new Set();
  const deps = data
    .split('\n')
    .map(line => {
      const [, blockedBy, item] = line.match(/Step ([A-Z]) .* step ([A-Z])/);
      allNodes.add(item).add(blockedBy);
      return { item, blockedBy };
    })
    .reduce((acc, depItem) => {
      const node = acc.find(dep => dep.item === depItem.item);
      if(node) {
        node.blockedBy = [...node.blockedBy, depItem.blockedBy];
      } else {
        acc.push({ item: depItem.item, blockedBy: [depItem.blockedBy]});
      }
      return acc;
    }, [])
    .sort((a, b) => a.item.localeCompare(b.item));

  return {
    allNodes: Array.from(allNodes).sort(),
    deps,
  };
}

const findFreeNodes = (allNodes, deps) => {
  const depsNodes = deps.map(dep => dep.item);
  return allNodes.filter(node => !depsNodes.includes(node));
}

const inputData = parseInput(fileData);

const cleanDepsFromNode = (deps, node) => {
  return deps.map(dep => {
    dep.blockedBy = dep.blockedBy.filter(blockedByNode => blockedByNode !== node);
    return dep;
  });
}

const traverseDepsTree = (allNodes, deps) => {
  let freeNodes = findFreeNodes(allNodes, deps);
  let freeNode = freeNodes.shift();
  const traverseOrder = [freeNode];
  
  do {
    deps = cleanDepsFromNode(deps, freeNode);
    const freeNodesFromDeps = deps.filter(dep => dep.blockedBy.length === 0).map(dep => dep.item); 
    freeNode = [...freeNodes, ...freeNodesFromDeps].sort().shift();

    deps = deps.filter(dep => dep.item !== freeNode);
    freeNodes = freeNodes.filter(freeNodesItem => freeNodesItem !== freeNode);

    traverseOrder.push(freeNode);  
  } while(deps.length);

  return traverseOrder;
}

const traverseOrder = traverseDepsTree(inputData.allNodes, inputData.deps) 
console.log(traverseOrder.join(''));