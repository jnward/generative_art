let GRID_SIZE = 12;

let row_colors, column_colors;
let grid;

function setup() {
  createCanvas(960, 960);
  strokeWeight(4);
  stroke(255);
  grid = makeGrid();
  row_colors, column_colors = getColors();
}

function mouseClicked() {
  GRID_SIZE = ceil(32 * mouseY/960)
  grid = makeGrid();
  row_colors, column_colors = getColors();
}

function draw() {
  // randomSeed(1);
  background(255);
  for (let i of Array(GRID_SIZE).keys()) {
    for (let j of Array(GRID_SIZE).keys()) {
      if (grid[i][j]) {
        drawSquare(i, j, true);
      } else {
        drawSquare(i, j, false);
      }
    }
  }
  // noLoop();
}

function makeGrid() {
  let grid = [];
  for (let i of Array(GRID_SIZE).keys()) {
    grid[i] = []
    for (let j of Array(GRID_SIZE).keys()) {
      grid[i][j] = int(Math.random() > 0.5)
    }
  }
  return grid;
}

function getColors() {
  row_colors = [];
  column_colors = [];
  
  for (let i of Array(GRID_SIZE).keys()) {
    row_colors[i] = color(floor(Math.random()*256), floor(Math.random()*256), floor(Math.random()*256));
    column_colors[i] = color(floor(Math.random()*256), floor(Math.random()*256), floor(Math.random()*256));
  }
  
  return row_colors, column_colors;
}

function drawSquare(i, j, left) {
  let size = 960/GRID_SIZE;
  let dist = mouseX / (3 * GRID_SIZE);
  // let dist = size / 4;
  let weight = dist;
  const x = i * size;
  const y = j * size;
  
  strokeWeight(0);
  
  const row_fill = color(200, 200, 54);
  const column_fill = color(145, 246, 32);
  
  
  if (left) {
    fill(column_colors[j]);
    rect(x, y+(size-dist), size, size-2*(size-dist));
    strokeWeight(weight);
    line(x, y+(size-dist), x+size, y+(size-dist));
    line(x, y+size-(size-dist), x+size, y+size-(size-dist));
    strokeWeight(0);
    
    fill(row_colors[i]);
    rect(x+(size-dist), y, size-2*(size-dist), size)
    strokeWeight(weight);
    line(x+(size-dist), y, x+(size-dist), y+size);
    line(x+size-(size-dist), y, x+size-(size-dist), y+size);
    strokeWeight(0);

  } else {

    fill(row_colors[i]);
    rect(x+(size-dist), y, size-2*(size-dist), size)
    strokeWeight(weight);
    line(x+(size-dist), y, x+(size-dist), y+size);
    line(x+size-(size-dist), y, x+size-(size-dist), y+size);
    strokeWeight(0);
    fill(column_colors[j]);
    rect(x, y+(size-dist), size, size-2*(size-dist));
    strokeWeight(weight);
    line(x, y+(size-dist), x+size, y+(size-dist));
    line(x, y+size-(size-dist), x+size, y+size-(size-dist));
    strokeWeight(0);
  }
}