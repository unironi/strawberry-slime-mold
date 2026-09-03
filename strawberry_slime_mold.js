let agents = [];
let scent = [];
let tempDiffuse = [];

let cellSize = 15
let scentAmount = 10;
let evaporation_rate = 0.99;
let kernel = [[1, 1, 1], [1, 2, 1], [1, 1, 1]];
let kernelCount = 10;
let numAgents = 25;
let bins = 16

let gridWidth;
let gridHeight;
let button;
let strawb;
let song;
let fft;

function preload() {
  strawb = loadImage("data/strawberry.png");
  song = loadSound("data/Strawberry_Fields_Forever.mp3");
}

function setup() {
  createCanvas(800,900);
  
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100);
  
  gridWidth = Math.floor(width/cellSize) + 1;
  gridHeight = Math.floor(height/cellSize) + 1;
  
  for(let row = 0; row < gridHeight; row++) {
    scent[row] = [];
    for (let col = 0; col < gridWidth; col++) {
      scent[row][col] = random(100); // random scents in grid
    }
    
    for (let col = 0; col < gridWidth / 2; col++) {
      scent[row][col] = random(100, 300); // environment bias
    }
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
      scent[row][col] = tempDiffuse[row][col];
    }
  }
}

function weighted_avg(row, col) {
  let avg = 0;
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      let tempRow = (row + i + gridHeight) % gridHeight;
      let tempCol = (col + j + gridWidth) % gridWidth;
      avg += scent[tempRow][tempCol] * kernel[i + 1][j + 1];
    }
  }
  return avg / kernelCount;
}

function fadeScent() {
  for(let row = 0; row < gridHeight; row++) {
    for (let col = gridWidth / 2; col < gridWidth; col++) {
      scent[row][col] *= evaporation_rate;
    }
  }
}

function displayScent() {
  noStroke();
  for(let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      fill(120, scent[row][col], scent[row][col]);
      rect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}
