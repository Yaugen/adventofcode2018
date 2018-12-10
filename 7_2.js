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

const inputData = parseInput(fileData);

const findFreeNodes = (allNodes, deps) => {
  const depsNodes = deps.map(dep => dep.item);
  return allNodes.filter(node => !depsNodes.includes(node));
}

const cleanDepsFromNode = (deps, node) => {
  return deps.map(dep => {
    dep.blockedBy = dep.blockedBy.filter(blockedByNode => blockedByNode !== node);
    return dep;
  });
}

const getWorkTime = workNode => workNode.charCodeAt() - 4;
const assingWork = (worker, freeNodes) => {
  const workNode = freeNodes.shift();

  if(workNode) {
    worker.workNode = workNode;
    worker.timeLeft = getWorkTime(workNode);
    worker.isIdle = false;
  } else {
    worker.workNode = '.';
    worker.timeLeft = 0;
    worker.isIdle = true;
  }
  return worker;
}

const WORKERS_COUNT = 5;
const initWorkers = freeNodes => Array.from({ length: WORKERS_COUNT }, () => assingWork({}, freeNodes));

const doWork = (allNodes, deps) => {
  let elapsedTime = 0;
  let freeNodes = findFreeNodes(allNodes, deps);
  let workers = initWorkers(freeNodes);

  do {
    //checkWorkers
    const doneWorkers = workers.filter(worker => worker.timeLeft === 0 && !worker.isIdle); 
    if (doneWorkers.length) {
      doneWorkers
        .map(worker => worker.workNode)
        .forEach(doneNode => {
          deps = cleanDepsFromNode(deps, doneNode);
        });



      const freeNodesFromDeps = deps.filter(dep => dep.blockedBy.length === 0).map(dep => dep.item); 
      deps = deps.filter(dep => dep.blockedBy.length !== 0);
      freeNodes = [...freeNodes, ...freeNodesFromDeps].sort();

      doneWorkers.forEach(worker => {
        worker.isIdle = true;
      });

      workers.filter(worker => worker.isIdle).forEach(worker => assingWork(worker, freeNodes));
    }

    elapsedTime += 1;
    workers.filter(worker => !worker.isIdle).forEach(worker => worker.timeLeft -= 1);
  } while(!workers.every(worker => worker.isIdle));

  return elapsedTime;
}

const elapsedTime = doWork(inputData.allNodes, inputData.deps) 
console.log(elapsedTime - 1);