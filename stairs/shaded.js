
const canvasHeight = 1000;
const canvasWidth = 2000;
const maxLength = canvasWidth / 3;
const maxHeight = canvasHeight / 3;
const maxDepth = 5;
const weight = 0;
const baseEnd = canvasWidth - canvasWidth * (1/5);
let steps = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  strokeWeight(0);
  stroke(0);
  background(255);
  fill(227);
  rect(0, canvasHeight/2, canvasWidth, canvasHeight/2);

  strokeWeight(weight);
  let root = new Step(0, 0, canvasHeight / 2, 200, false, null);
  steps.push(root);
  steps[0].drawChildren();
  for (let step of steps) {
    if (step.ends && !step.middle) {
      let quadHeight = maxHeight * 2 ** (-step.depth - 1);
      // let quadWidth = quadHeight * 1/2;
      let quadWidth = quadHeight * 1/sqrt(2);
      strokeWeight(0);
      triangle(
        baseEnd - quadWidth * 2,
        step.y,
        baseEnd + 1000,
        step.y + 1000 * sqrt(2),
        baseEnd + 1000,
        step.y - 1000 * sqrt(2)
      )

      point(baseEnd, step.y);
      strokeWeight(0);
    }
  }
}

function draw() {
  noLoop();
}

class Step {
  constructor(depth, x, y, length, middle, parent = null) {
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.length = length;
    this.middle = middle;
    this.terminates = middle || this.ends;
    this.parent = parent;
  }

  makeChildren() {
    if (this.terminates) {
      return [];
    }
    console.log(this.depth);
    console.log(this.length);
    console.log(this.x);
    console.log(this.y);
    let children = [];
    let newDepth = this.depth + 1;

    let r = Math.random();

    for (let i = 0; i < 3; i++) {
      let newLength = this.terminates ? canvasWidth : maxHeight * 2 ** (-this.depth - 1) + Math.random() * maxLength;
      // let newLength = this.terminates ? canvasWidth : maxHeight * 2 ** (-this.depth - 1) + r * maxLength;
      let newX = this.x + this.length + !(1 - i) * maxHeight * 2 ** (-newDepth) * 1/Math.sqrt(2);
      let newY = this.y + (1 - i) * maxHeight * 2 ** (-newDepth);
      let newMiddle = !(1 - i);
      console.log(newMiddle);

      let newStep = new Step(newDepth, newX, newY, newLength, newMiddle, this);
      children.push(newStep);
    }
    return children;

  }

  get ends() {
    return (this.x < baseEnd && this.x + this.length >= baseEnd) || (this.x < baseEnd && this.depth >= maxDepth);
    let doesEnd = this.x + this.length >= baseEnd && this.x < baseEnd;
    //doesEnd ||= (this.middle && this.x < baseEnd);
    return doesEnd;
  }

  draw() {
    steps.push(this);
    let quadHeight = maxHeight * 2 ** (-this.depth - 1);
    // let quadWidth = quadHeight * 1/2;
    let quadWidth = quadHeight * 1/sqrt(2);
    if (!this.terminates && this.depth < maxDepth) {
      fill(227);
      strokeWeight(0);
      rect(
        this.x + this.length,
        this.y - quadHeight,
        canvasWidth,
        quadHeight,
      )
      fill(255);
      rect(
        this.x + this.length,
        this.y,
        canvasWidth,
        quadHeight,
      )
    }
    strokeWeight(weight);
    line(this.x, this.y, canvasWidth, this.y);
    if (!this.terminates && this.depth < maxDepth) {
      fill(200);
      quad(
        this.x - quadWidth + this.length,
        this.y,
        this.x + this.length,
        this.y + quadHeight,
        this.x + quadWidth + this.length,
        this.y,
        this.x + this.length,
        this.y - quadHeight,
      );
    }

  }

  drawChildren() {
    this.draw();
    if (this.terminates) {
      return;
    }
    if (this.depth >= maxDepth) {
      return;
    }
    for (let child of this.makeChildren()) {
      child.drawChildren();
    }
  }
}