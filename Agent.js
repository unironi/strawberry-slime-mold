class Agent {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.fromAngle(random(2 * PI));
    this.vel.setMag(cellSize * 0.1);
    this.senseAngle = 0.2 * PI;
    this.senseLen = 10 * cellSize;
    this.turnAngle = 0.2 * PI;
    this.randomAngle = 0.5;
    this.binNo = int(random(bins));
    this.amp = 1;
    this.freqHue = map(this.binNo, 0, bins, 0, 360);
    this.ampSatBri = map(this.amp, 0, 256, 0, 100);
    this.img_index = floor(map(this.binNo, 0, bins, 0, images.length))
  }
  
  update(amp) {
    this.amp = max(1, amp);
    this.ampSatBri = map(this.amp, 0, 256, 0, 100);
    
    let sensorDict = {
      sensorLeft: [this.getScent(this.senseAngle), this.senseAngle],
      sensorI1: [this.getScent(this.senseAngle / 2), this.senseAngle / 2], // intermediate sensor 1
      sensorRight: [this.getScent(-this.senseAngle), -this.senseAngle],
      sensorI2: [this.getScent(-this.senseAngle / 2), -this.senseAngle / 2], // intermediate sensor 2
      sensorCenter: [this.getScent(0), 0],
    };
    
    let max_scent = Object.keys(sensorDict).reduce((a, b) => sensorDict[a][0] > sensorDict[b][0] ? a : b); // getting key of max sensor value
    let max_scent_angle = sensorDict[max_scent][1];
    
    if (random() < this.randomAngle) { // to encourage exploration
      max_scent_angle = random(...Object.values(sensorDict).map(arr => arr[1]));
    }
    // this.vel.rotate(max_scent_angle);
    let angle = map(this.amp, 0, 256, 0, max_scent_angle);
    this.vel.rotate(angle);
    
    
    this.pos.add(this.vel);
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
    this.placeScent();

    
  }
  
  placeScent() {
    let x = Math.floor(this.pos.x/cellSize) % gridWidth; // column
    let y = Math.floor(this.pos.y/cellSize) % gridHeight; // row
    scent[y][x][1] += this.ampSatBri;
    scent[y][x][0] = this.freqHue;
  }
  
  getScent(angle) {
    let x = this.pos.x + this.senseLen * cos(this.vel.heading() + angle);
    let y = this.pos.y + this.senseLen * sin(this.vel.heading() + angle);
    x = (x + width) % width;
    y = (y + height) % height;
    x = Math.floor(x/cellSize) % gridWidth;
    y = Math.floor(y/cellSize) % gridHeight;
    return(scent[y][x][1]);
  }
  
  display() {
    //stroke(0);
    //fill(300, 100, 100);
    push();
    if (images[this.img_index] == eye) {
      images[this.img_index].resize(cellSize*2, cellSize);
    } else {
      images[this.img_index].resize(cellSize*2, cellSize*2);
    }
    image(images[this.img_index], this.pos.x, this.pos.y);
    translate(this.pos.x, this.pos.y);
    //rotate(this.vel.heading());
    //rect(0, 0, cellSize * 2, cellSize * 2);
    //line(0, 0, 10, 0);
    pop();
  }
  
  
}
