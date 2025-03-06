class SnowfallGraph {
  constructor() {
    this.months = ["nov", "dec", "jan", "feb"];
    this.currentMonth = "nov";  // Starting with November
    this.dx = 0;
    this.yAxisOffset = 40;
    this.allData = {};
    this.width = 600;
    this.height = 400;
  }

  preload() {
    // Load JSON for each month
    this.nov = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202411.json');
    this.dec = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202412.json');
    this.jan = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202501.json');
    this.feb = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202502.json');
  }

  setup() {
    createCanvas(this.width, this.height);
    this.dx = (this.width - this.yAxisOffset) / 33;  // Space between each day's data point
    // Extract snowfall data for each month
    this.allData.nov = this.extractSnowfallData(this.nov);
    this.allData.dec = this.extractSnowfallData(this.dec);
    this.allData.jan = this.extractSnowfallData(this.jan);
    this.allData.feb = this.extractSnowfallData(this.feb);
    noLoop();
  }

  draw() {
    background(220);
    let dataToDraw = this.allData[this.currentMonth];

    let px = this.yAxisOffset + this.dx;  // 1st day
    let py = map(dataToDraw[0], 0, 3, this.height * 0.8, this.height * 0.2);  

    for (let i = 1; i < dataToDraw.length; i++) {
      let cx = this.yAxisOffset + this.dx * (i + 1);  
      let cy = map(dataToDraw[i], 0, 3, this.height * 0.8, this.height * 0.2);  
      line(px, py, cx, cy);  
      px = cx;  
      py = cy;  
    }

    this.axes();
    this.labels();
    this.drawDays();
    this.drawMonth();
  }

  extractSnowfallData(jsonData) {
    let centralParkData = [];
    let data = jsonData.data["USW00094728"];  // Central Park data
    
    if (data) {
      let dailyData = data.values;
      for (let day in dailyData) {
        let snowfall = dailyData[day];
        if (snowfall === "T") snowfall = 0;
        else if (snowfall === "M") continue;
        else snowfall = parseFloat(snowfall);
        if (!isNaN(snowfall)) centralParkData.push(snowfall);
      }
    }
    return centralParkData;
  }

  axes() {
    line(this.yAxisOffset, this.height * 0.1, this.yAxisOffset, this.height * 0.88);
    line(this.yAxisOffset, this.height * 0.88, this.width - 20, this.height * 0.88);

    for (let i = 0; i <= 3; i++) {
      let yPosition = map(i, 0, 3, this.height * 0.8, this.height * 0.2);
      textAlign(RIGHT, CENTER);
      textSize(12);
      text(i, this.yAxisOffset - 10, yPosition);
    }
  }

  labels() {
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Day of Month", this.width / 2, this.height * 0.95);
    textSize(20);
    text("Daily Snowfall at Central Park", this.width / 2, this.height * 0.05);
    
    textAlign(CENTER, CENTER);
    push();
    translate(this.yAxisOffset - 30, this.height / 2);
    rotate(PI * 1.5);
    textSize(16);
    text("Snowfall (in inches)", 0, 0);
    pop();
  }

  drawDays() {
    let dataToDraw = this.allData[this.currentMonth];
    for (let i = 0; i < dataToDraw.length; i++) {
      textAlign(CENTER, CENTER);
      textSize(12);
      text(i + 1, this.yAxisOffset + this.dx * (i + 1), this.height * 0.91);  
    }
  }

  drawMonth() {
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.currentMonth.toUpperCase(), this.width / 2, this.height * 0.1);  
  }

  keyPressed() {
    if (key === 'n' || key === 'N') this.currentMonth = 'nov';
    else if (key === 'd' || key === 'D') this.currentMonth = 'dec';
    else if (key === 'j' || key === 'J') this.currentMonth = 'jan';
    else if (key === 'f' || key === 'F') this.currentMonth = 'feb';
    redraw();
  }
}

// Initialize the graph object
let snowfallGraph;

function preload() {
  snowfallGraph = new SnowfallGraph();
  snowfallGraph.preload();
}

function setup() {
  snowfallGraph.setup();
}

function draw() {
  snowfallGraph.draw();
}

function keyPressed() {
  snowfallGraph.keyPressed();
}
