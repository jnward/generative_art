
const canvasHeight = 1000;
const canvasWidth = 1000;
const maxDepth = 4;
const skew = Math.sqrt(2);
const maxLength = canvasWidth / 4;
const maxHeight = canvasHeight / 2 - (canvasHeight / 2) % 2**(maxDepth+3);
const weight = 1;
let baseEnd = canvasWidth - canvasWidth * (1/5);
const shade = false;
const cross = true;
const delta1 = 1;
const delta2 = 2;
let steps = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight, SVG);
  strokeWeight(0);
  stroke(0);
  // background(255);
  fill(0, 0, 0, 0);
}

function mousePressed() {
  // save('test.svg');
}

function draw() {
  if (shade) {
    fill(227);
    rect(0, canvasHeight/2, canvasWidth, canvasHeight/2);
  }

  strokeWeight(weight);
  line(maxHeight/2, canvasHeight/2 - maxHeight, baseEnd, canvasHeight/2 - maxHeight);
  line(maxHeight/2, canvasHeight/2 + maxHeight, baseEnd, canvasHeight/2 + maxHeight);
  line(0, canvasHeight/2, maxHeight/2, canvasHeight/2 - maxHeight);
  line(0, canvasHeight/2, maxHeight/2, canvasHeight/2 + maxHeight);
  let newLength = (maxHeight * 2 ** (1-2) + random() * maxLength);
  let root = new Step(0, 0, canvasHeight / 2, newLength, false, null);
  steps.push(root);
  steps[0].drawChildren();
  line(baseEnd + maxHeight/2, canvasHeight/2, baseEnd, canvasHeight/2 - maxHeight);
  line(baseEnd + maxHeight/2, canvasHeight/2, baseEnd, canvasHeight/2 + maxHeight);
  noLoop();
}

class Step {
  constructor(depth, x, y, length, middle, parent = null) {
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.length = length;
    this.middle = middle;
    this.parent = parent;
    this.quadHeight = maxHeight * 2 ** (-this.depth - 1);
    this.quadWidth = maxHeight * 2 ** (-this.depth - 1) / 2;
    this.terminates = middle || this.ends;
    // console.log(this.quadHeight, this.quadWidth);
  }

  makeChildren() {
    if (this.terminates) {
      return [];
    }
    let children = [];
    let newDepth = this.depth + 1;

    let r = random();

    for (let i = 0; i < 3; i++) {
      let newLength = this.terminates ? canvasWidth : (maxHeight * 2 ** (-this.depth - 3) + random() * maxLength);
      // let newLength = this.terminates ? canvasWidth : (maxHeight * 2 ** (-this.depth - 3) + r * maxLength);
      let newX = this.x + this.length + !(1 - i) * maxHeight * 2 ** (-newDepth) * 1/2;
      let newY = this.y + (1 - i) * maxHeight * 2 ** (-newDepth);
      let newMiddle = !(1 - i);

      let newStep = new Step(newDepth, newX, newY, newLength, newMiddle, this);
      children.push(newStep);
    }
    return children;

  }

  get ends() {
    // let quadHeight = maxHeight * 2 ** (-this.depth - 1);
    // let quadWidth = quadHeight * 1/2;
    // let quadWidth = quadHeight * 1/2;
    return (this.x < baseEnd && this.x + this.length + this.quadWidth >= baseEnd) || (this.x < baseEnd && this.depth >= maxDepth);
  }

  get endX() {
    let quadHeight = maxHeight * 2 ** (-this.depth - 1);
    // let quadWidth = quadHeight * 1/2;
    let quadWidth = quadHeight * 1/2;
    return !this.terminates ?
      this.x + this.length - this.quadWidth :
      this.middle ? baseEnd :
      baseEnd - this.quadWidth * 2;
  }

  draw() {
    steps.push(this);
    // let quadHeight = maxHeight * 2 ** (-this.depth - 1);
    // let quadWidth = quadHeight * 1/2;
    // let quadWidth = quadHeight * 1/2;
    if (!this.terminates && this.depth < maxDepth && shade) {
      fill(227);
      strokeWeight(0);
      rect(
        this.x + this.length,
        this.y - this.quadHeight,
        canvasWidth,
        this.quadHeight,
      )
      fill(255);
      rect(
        this.x + this.length,
        this.y,
        canvasWidth,
        this.quadHeight,
      )
    }
    if (!this.terminates && this.depth < maxDepth && cross) {
      // let d = 10;
      for (let d = 8; d <= this.length - this.quadWidth; d += 8) {
        // line(
        //   this.x + d,
        //   this.y,
        //   this.x + d + this.quadWidth*2,
        //   this.y + this.quadHeight*2
        // );
        // break;
      }
    }
    strokeWeight(weight);
    let endX = !this.terminates ?
      this.x + this.length - this.quadWidth:
      canvasWidth;
    line(this.x, this.y, this.endX, this.y);
    if (!this.terminates && this.depth < maxDepth) {
      if (shade) {
        fill(200);
      }
      quad(
        this.x - this.quadWidth + this.length,
        this.y,
        this.x + this.length,
        this.y + this.quadHeight,
        this.x + this.quadWidth + this.length,
        this.y,
        this.x + this.length,
        this.y - this.quadHeight,
      );
      if (cross) {
        for (let d = delta2; d <= this.quadWidth; d += delta2) {
          line(
            this.x + d - this.quadWidth + this.length,
            this.y + d * 2,
            this.x + d + this.length,
            this.y + d * 2 - this.quadHeight,
          );
        }
        for (let d = delta1; d <= this.quadWidth; d += delta1) {
          let parent = this;
          for (let i = 0; i < this.depth; i++) {


            if (this.y < parent.parent.y) {
              break;
            }

            parent = parent.parent;
          }
          let endX = parent.x + (this.y + d*2 - parent.y)/2;
          line(
            this.x + d - this.quadWidth + this.length,
            this.y + d * 2,
            endX,
            this.y + d * 2,
          );
        }
      }
    }
    // point(baseEnd, this.y);
    if (this.ends && !this.middle) {
      line(
        baseEnd - this.quadWidth * 2,
        this.y,
        baseEnd,
        this.y + this.quadHeight * 2
      );
      line(
        baseEnd - this.quadWidth * 2,
        this.y,
        baseEnd,
        this.y - this.quadHeight * 2
      );
      for (let d = delta1; d <= this.quadHeight; d += delta1) {
        let parent = this;
        for (let i = 0; i < this.depth; i++) {


          if (this.y < parent.parent.y) {
            break;
          }

          parent = parent.parent;
        }
        let endX = parent.x + (this.y + d*2 - parent.y)/2;
        line(
          baseEnd -this.quadHeight + d,
          this.y + d * 2,
          endX,
          this.y + d * 2,
        );
      }
      for (let d = delta2; d <= this.quadHeight; d += delta2) {
        let down = this.y - (canvasHeight/2 - maxHeight) + d*2;
        line(  // wtf is this math
          baseEnd -this.quadHeight + d,
          this.y + d * 2,
          baseEnd + down/4 - this.quadWidth + d/2,
          canvasHeight/2 - maxHeight + down/2 + d - this.quadHeight
        );
      }
    }

  }

  drawChildren() {
    this.draw();
    if (this.terminates) {
      return;
    }
    // if (this.ends) {
    //   return;
    // }
    // if (this.depth >= maxDepth) {
    //   return;
    // }
    for (let child of this.makeChildren()) {
      child.drawChildren();
    }
  }
}