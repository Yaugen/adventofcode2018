// "#1307 @ 42,472: 13x14"
const parseInputLine = line => {
  const reg = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/g;
  const [, id, left, top, width, height] = reg.exec(line);

  return {
    id: Number(id),
    left: Number(left),
    top: Number(top),
    right: Number(left) + Number(width),
    bottom: Number(top) + Number(height),
    width: Number(width),
    height: Number(height),
  };
}

const findMaxRightAndBottom = data =>
  data.reduce(({ maxRight, maxBottom }, { right, bottom }) => ({
    maxRight: right > maxRight ? right : maxRight,
    maxBottom: bottom > maxBottom ? bottom : maxBottom,
  }), { maxRight: 0, maxBottom: 0 });


const make2DArray = (width, height) => {
  return Array.from({ length: width }, () => (
    Array.from({ length: height }, () => 0)
  ))
};

const claimArea = (field, claim) => {
  const { left, top, right, bottom, width, height } = claim;
  for (let col = left; col < right; col++) {
    for (let row = top; row < bottom; row++) {
      field[col][row] += 1
    }
  }
}

const claimAllAreas = (field, claims) => {
  claims.forEach(claim => claimArea(field, claim));
  return field;
}

const countOverlaps = field => {
  return field.reduce((colAcc, row) => (
    row.reduce((rowAcc, cell) => (cell > 1 ? rowAcc + 1 : rowAcc), colAcc)
  ), 0)
}

const findNotOverlapped = (field, claims) => {
  return claims.find(claim =>
    field.slice(claim.left, claim.right)
      .every(row => (
        row.slice(claim.top, claim.bottom)
          .every(cell => cell === 1)
      ))
  );
}

module.exports = {
  parseInputLine,
  findMaxRightAndBottom,
  make2DArray,
  claimArea,
  claimAllAreas,
  countOverlaps,
  findNotOverlapped,
};