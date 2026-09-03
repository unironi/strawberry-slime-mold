let agents = [];
let scent = [];
let tempDiffuse = [];

let cellSize = 25
let scentAmount = 10;
let evaporation_rate = 0.99;
let kernel = [[1, 1, 1], [1, 2, 1], [1, 1, 1]];
let kernelCount = 10;
let numAgents = 25;
let bins = 32

let gridWidth;
let gridHeight;

let button;

let strawb;
let eye;
let flower;
let star;
let keyi;
let paint;
let images;

let song;
let fft;

function preload() {
  strawb = loadImage("data/strawb.png");
  eye = loadImage("data/eye.png");
  flower = loadImage("data/flower.png");
  star = loadImage("data/star.png");
  keyi = loadImage("data/key.png");
  paint = loadImage("data/paint.png");
  
  images = [strawb, eye, flower];
  
  // song = loadSound("data/Strawberry_Fields_Forever.mp3");
  song = loadSound("data/A_Case_Of_You.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100);
  
  gridWidth = Math.floor(width/cellSize) + 1;
  gridHeight = Math.floor(height/cellSize) + 1;
  
  for(let row = 0; row < gridHeight; row++) {
    scent[row] = [];
    for (let col = 0; col < gridWidth; col++) {
      scent[row][col] = [24, random(100)]; // random scents in grid [hue value, saturation/brightness value]
    }
    
    //for (let col = 0; col < gridWidth / 2; col++) {
    //  scent[row][col] = random(100, 300); // environment bias
    //}
  }
  
  for(let row = 0; row < gridHeight; row++) {
    tempDiffuse[row] = [];
    for (let col = 0; col < gridWidth; col++) {
      tempDiffuse[row][col] = 0;
    }
  }
  
  for(let i = 0; i < numAgents; i++) {
    agents.push(new Agent());
  }
  
  for(let i = 0; i < agents.length; i++) { console.log(agents[i].binNo); }
  
  button = createButton("toggle");
  button.mousePressed(toggleSong);
  song.play();
  fft = new p5.FFT(0, bins);
}

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function draw() {
  let spectrum = fft.analyze();
  
  for(let i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > 0) {
      for (let a of agents) {
        if (a.binNo == i) {
          a.update(spectrum[i]);
        }
      }
    }
    
  }
  
  fadeScent();
  diffuseScent(); // makes agents converge into nuclei faster
  displayScent();
  for(let a of agents) {
    a.display();
  }
}

function diffuseScent() {
  for(let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      tempDiffuse[row][col] = weighted_avg(row, col); // do weighted average of pixel (row, col) and its neighbours using a kernel
    }
  }
  
  for(let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      scent[row][col][1] = tempDiffuse[row][col];
    }
  }
}

function weighted_avg(row, col) {
  let avg = 0;
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      let tempRow = (row + i + gridHeight) % gridHeight;
      let tempCol = (col + j + gridWidth) % gridWidth;
      avg += scent[tempRow][tempCol][1] * kernel[i + 1][j + 1];
    }
  }
  return avg / kernelCount;
}

function fadeScent() {
  for(let row = 0; row < gridHeight; row++) {
    //for (let col = gridWidth / 2; col < gridWidth; col++) {
    //  scent[row][col] *= evaporation_rate;
    //}
    for (let col = 0; col < gridWidth; col++) {
      scent[row][col][1] *= evaporation_rate;
    }
  }
}

function displayScent() {
  noStroke();
  for(let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      fill(scent[row][col][0], scent[row][col][1], scent[row][col][1]);
      rect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}
