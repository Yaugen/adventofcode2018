const { processLines, Device, compareArrays } = require('./16_0');

const countSuitable = (data) => {
  const device = new Device();
  const operNames = device.getOperNames();
  return data.reduce((threeOrMore, dataItem) => {
    const { before, after, oper } = dataItem;
    const suitable = operNames.reduce((operCount, operName) => {
      const [operCode, ...operArgs] = oper;
      return compareArrays(after, device.runOper(operName, before, operArgs))
        ? operCount + 1
        : operCount;
    }, 0);
    return suitable >= 3 ? threeOrMore + 1 : threeOrMore;
  }, 0);
}

const run = async () => {
  const { firstPart, secondPart } = await processLines('./16_0_input.txt');
  // console.log(countSuitable(firstPart));

  const device = new Device();
  device.train(firstPart);

  secondPart.forEach(oper => device.runOperCodeInContext(oper));
  console.log(device.regs);
}



run();