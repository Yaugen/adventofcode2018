class ListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class List {
  constructor() {
    this.top = null;
    this.length = 0;
  }

  findByIndex(index) {
    let curIndex = 0;
    let curNode = this.top;

    while(curIndex < this.length) {
      if(curIndex === index) {
        return curNode;
      }
      curIndex += 1;
      curNode = curNode.next;
    }
    return undefined;
  }

  insertOnIndex(index, value) {
    if (index === 0) {
      const newNode = new ListNode(value, this.top);
      this.top = newNode;
    } else {
      const prevNode = this.findByIndex(index - 1);
      const newNode = new ListNode(value, prevNode.next);
      prevNode.next = newNode;
    }
    this.length += 1;
  }

  removeOnIndex(index) {
    if (index === 0) {
      this.top = this.top.next;
    } else {
      const prevNode = this.findByIndex(index - 1);
      prevNode.next = prevNode.next ? prevNode.next.next : null;
    }
    this.length -= 1;
  }

  values() {
    const values = [];
    let curIndex = 0;
    let curNode = this.top;

    while(curIndex < this.length) {
      values.push(curNode.value);

      curIndex += 1;
      curNode = curNode.next;
    }

    return values;
  }
}

const addAfter = (value, marble) => {
  const toAdd = {
      value,
      prev: marble,
      next: marble.next,
  };
  marble.next.prev = toAdd;
  marble.next = toAdd;
  return toAdd;
};

const listSolution = (input) => {
  const [playerCount, marbleCount] = input.match(/\d+/g).map(Number);
  
  const scores = {};
  for (let i = 1; i <= playerCount; i += 1) {
      scores[i] = 0;
  }
  let currentPlayer = 1;
  
  let current = {
      value: 0,
  };
  current.next = current;
  current.prev = current;
  
  for (let m = 1; m <= marbleCount; m += 1) {
      if (m % 23 === 0) {
          scores[currentPlayer] += m;
          current = current.prev.prev.prev.prev.prev.prev;
          scores[currentPlayer] += current.prev.value;
          current.prev.prev.next = current;
          current.prev = current.prev.prev;
      } else {
          current = addAfter(m, current.next);
      }
      currentPlayer = currentPlayer % playerCount + 1;
  }
  
  return Math.max(...Object.values(scores));
};

module.exports = {
  listSolution,
  List,
}