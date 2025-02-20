let nov, dec, jan, feb;
let allData = {};
let months = ["nov", "dec", "jan", "feb"];
let currentMonth = "nov";  // Starting with November
let dx;  
let yAxisOffset = 40; 

function preload() {
  // Load JSON for each month
  nov = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202411.json');
  dec = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202412.json');
  jan = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202501.json');
  feb = loadJSON('https://www.ncei.noaa.gov/access/monitoring/daily-snow/NY-snowfall-202502.json');
}

function setup() {
  createCanvas(600, 400);
  dx = (width - yAxisOffset) / 33;  
  
  // Extract snowfall data for Central Park for each month
  allData.nov = extractSnowfallData(nov);
  allData.dec = extractSnowfallData(dec);
  allData.jan = extractSnowfallData(jan);
  allData.feb = extractSnowfallData(feb);
  
  noLoop();
}

function draw() {
  background(220);
  
  // Data for the current month
  let dataToDraw = allData[currentMonth];
  
  let px = yAxisOffset + dx;  // 1st day
  let py = map(dataToDraw[0], 0, 3, height * 0.8, height * 0.2);  
  
  for (let i = 1; i < dataToDraw.length; i++) {
    let cx = yAxisOffset + dx * (i + 1);  
    let cy = map(dataToDraw[i], 0, 3, height * 0.8, height * 0.2);  
    
    line(px, py, cx, cy);  
    
    px = cx;  
    py = cy;  
  }
  
  // Draw the axes and labels
  axes();
  labels();
  
  drawDays();
  
  drawMonth();
}

function extractSnowfallData(jsonData) {
  let centralParkData = [];
  let data = jsonData.data["USW00094728"];  // Access the Central Park data
  
  if (data) {
    let dailyData = data.values;

    // Iterate through each day
    for (let day in dailyData) {
      let snowfall = dailyData[day];

      // Handle "T" (trace) by converting it to 0
      if (snowfall === "T") {
        snowfall = 0;
      } 
      
      // Handle "M" (missing) by skipping it
      else if (snowfall === "M") {
        continue;
      } 
      else {
        snowfall = parseFloat(snowfall);  // Make sure we have a number
      }

      // Makes sure only valid numbers go into the data array
      if (!isNaN(snowfall)) {
        centralParkData.push(snowfall);
      }
    }
  }
  
  return centralParkData;
}

function axes() {
  // Y-axis
  line(yAxisOffset, height * 0.1, yAxisOffset, height * 0.88);
  
  // X-axis
  line(yAxisOffset, height * 0.88, width - 20, height * 0.88);
  
  for (let i = 0; i <= 3; i++) {
    let yPosition = map(i, 0, 3, height * 0.8, height * 0.2);
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(i, yAxisOffset - 10, yPosition); 
  }
}

function labels() {
  // X-axis label
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Day of Month", width / 2, height * 0.95);
  
  // Graph title
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Daily Snowfall at Central Park", width / 2, height * 0.05);
  
  // Y-axis label
  textAlign(CENTER, CENTER);
  push();
  translate(yAxisOffset - 30, height / 2);
  rotate(PI * 1.5);
  textSize(16);
  text("Snowfall (in inches)", 0, 0);
  pop();
}

function drawDays() {
  let dataToDraw = allData[currentMonth];
  for (let i = 0; i < dataToDraw.length; i++) {
    textAlign(CENTER, CENTER);
    textSize(12);
    text(i + 1, yAxisOffset + dx * (i + 1), height * 0.91);  
  }
}

function drawMonth() {
  textAlign(CENTER, CENTER);
  textSize(18);
  text(currentMonth.toUpperCase(), width / 2, height * 0.1);  
}

function keyPressed() {
  // Cycle through months when keys are pressed
  if (key === 'n' || key === 'N') {
    currentMonth = 'nov';
  } else if (key === 'd' || key === 'D') {
    currentMonth = 'dec';
  } else if (key === 'j' || key === 'J') {
    currentMonth = 'jan';
  } else if (key === 'f' || key === 'F') {
    currentMonth = 'feb';
  }
  
  redraw();
}
