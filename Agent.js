class Agent {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.fromAngle(random(2 * PI));
    this.vel.setMag(cellSize * 0.1);
    this.senseAngle = 0.4 * PI;
    this.senseLen = 8 * cellSize;
    this.turnAngle = 0.2 * PI;
  }
  
  update() {
    let scentLeft = this.getScent(this.senseAngle);
    let scentRight = this.getScent(-this.senseAngle);
    let scentCenter = this.getScent(0);
    
    if (scentLeft > scentRight && scentLeft > scentCenter) {
      this.vel.rotate(this.turnAngle);
    }
    
    if (scentRight > scentLeft && scentRight > scentCenter) {
      this.vel.rotate(-this.turnAngle);
    }
    
    this.pos.add(this.vel);
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
    
    this.placeScent();
  }
  
  placeScent() {
    let x = Math.floor(this.pos.x/cellSize) % gridWidth; // column
    let y = Math.floor(this.pos.y/cellSize) % gridHeight; // row
    scent[y][x] += scentAmount;
  }
  
  getScent(angle) {
    let x = this.pos.x + this.senseLen * cos(this.vel.heading() + angle);
    let y = this.pos.y + this.senseLen * sin(this.vel.heading() + angle);
    x = (x + width) % width;
    y = (y + height) % height;
    x = Math.floor(x/cellSize) % gridWidth;
    y = Math.floor(y/cellSize) % gridHeight;
    return(scent[y][x]);
  }
  
  display() {
    // stroke(0);
    //noStroke();
    //fill(300, 100, 100);
    push();
    image(strawb, this.pos.x, this.pos.y);
    strawb.resize(cellSize*2, cellSize*2);
    image(strawb, this.pos.x, this.pos.y);
    //translate(this.pos.x, this.pos.y);
    //rotate(this.vel.heading());
    //rect(0, 0, cellSize * 2, cellSize * 2);
    // line(0, 0, 10, 0);
    pop();
  }
  
  
}
