/////////////////////////////////////////   Functions that initialize DOM and Game Parts

function seedCanvas() {
  //Creates a random seed
  let canvas = [];
  for (let i = 0; i < 20; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      row.push(Math.floor(Math.random() * 2));
    }
    canvas.push(row);
  }
  return canvas;
}

let canvas = seedCanvas();

function createDOM(canvas) {
  canvas.forEach((row, idx) => {
    let _row = document.createElement("tr");
    row.forEach(cell => {
      let _cell = document.createElement("td");
      _cell.innerText = cell;
      if (cell) {
        _cell.classList.add("alive");
      }
      _row.classList.add(idx);
      _row.appendChild(_cell);
    });
    document.getElementById("main").appendChild(_row);
  });
}

function updateDOM(canvas) {
  canvas = [].concat.apply([], canvas);
  let domNodes = document.getElementsByTagName("td");
  domNodes = Array.prototype.slice.call(domNodes);

  canvas.forEach((cell, i) => {
    let currentNode = domNodes[i];
    if (cell) {
      currentNode.innerText = 1;
      if (!currentNode.classList.contains("alive")) {
        currentNode.classList.add("alive");
      }
    } else {
      currentNode.innerText = 0;
      if (currentNode.classList.contains("alive")) {
        currentNode.classList.remove("alive");
      }
    }
  });
}
/////////////////////////////////////////   Functions related to Game Logic
function play(grid) {
  function countNeighbors(grid, y, x) {
    let n = 0;
    const nCoords = [
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];
    nCoords.forEach(c => {
      try {
        if (grid[y + c[0]][x + c[1]]) {
          n++;
        }
      } catch (e) {}
    });
    return n;
  }

  function killOrSurvive(val, neighbors) {
    //Decides whether to kill a cell or let it survie another generation
    if (val) {
      if (neighbors < 2) return 0;
      if (neighbors < 4) return 1;
      return 0;
    } else {
      if (neighbors === 3) return 1;
      return 0;
    }
  }
  return grid.map((row, y) => {
    return row.map((cell, x) => {
      return killOrSurvive(cell, countNeighbors(grid, y, x));
    });
  });
}

//////////////////////////////// DOM Logic and Event Handling

let t; //Tracks Interval
let gen = 0; //Tracks generations passed
let currentSpeed = 1000;
updateGen();

function updateGen() {
  document.getElementById("gen").innerHTML = "Generations passed: " + gen;
}

function playAndUpdate() {
  gen++;
  updateGen();
  canvas = play(canvas);
  updateDOM(canvas);
}

function changeIntervalSpeed(id, newSpeed, currentSpeed) {
  if (newSpeed !== currentSpeed) {
    clearInterval(id);
    id = setInterval(playAndUpdate, newSpeed);
    return [id, newSpeed];
  } else {
    return [id, currentSpeed];
  }
}

//Event listener for generation passing speed
const speedHandlers = [
  { id: "slow", speed: 1000 },
  { id: "medium", speed: 500 },
  { id: "fast", speed: 100 }
];
speedHandlers.forEach(handler => {
  document.getElementById(handler.id).addEventListener("click", () => {
    [t, currentSpeed] = changeIntervalSpeed(t, handler.speed, currentSpeed);
  });
});

document.getElementById("start").addEventListener("click", () => {
  if (t) clearInterval(t);
  t = setInterval(playAndUpdate, currentSpeed);
});
document.getElementById("stop").addEventListener("click", () => {
  clearInterval(t);
});

createDOM(canvas);

let cells = Array.prototype.slice.call(document.getElementsByTagName("td"));
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", () => {
    let parentIndex = Math.floor(i / 10);
    let childIndex = i % 10;

    canvas[parentIndex][childIndex] = 1;

    updateDOM(canvas);
  });
}
