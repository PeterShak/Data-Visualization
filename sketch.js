class DataVisualization {
  constructor() {
    this.data = {};
    this.currentDataset = null;
    this.yAxisOffset = 40;
    this.width = 600;
    this.height = 400;
    this.daysInMonth = {
      'nov': 30,
      'dec': 31,
      'jan': 31,
      'feb': 28,
    };
  }

  addData(label, dataValues) {
    this.data[label] = dataValues.map(value => parseFloat(value));
  }

  setup() {
    createCanvas(this.width, this.height);
    noLoop();
  }

  draw() {
    background(220);

    if (!this.currentDataset) {
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Please select a dataset (n, d, j, f)", this.width / 2, this.height / 2);
      return;
    }

    let dataToDraw = this.data[this.currentDataset];

    if (!dataToDraw) {
      textAlign(CENTER, CENTER);
      textSize(20);
      text("No data for the selected dataset.", this.width / 2, this.height / 2);
      return;
    }

    let numDataPoints = this.daysInMonth[this.currentDataset];
    let dx = (this.width - this.yAxisOffset - 40) / (numDataPoints - 1);

    let minValue = Math.min(...dataToDraw);
    let maxValue = Math.max(...dataToDraw);

    let px = this.yAxisOffset;
    let py = this.mapY(dataToDraw[0], minValue, maxValue);

    for (let i = 1; i < dataToDraw.length; i++) {
      let cx = this.yAxisOffset + dx * i;
      let cy = this.mapY(dataToDraw[i], minValue, maxValue);

      line(px, py, cx, cy);
      px = cx;
      py = cy;
    }

    this.axes(numDataPoints);
    this.labels();
    this.drawDays(numDataPoints);
    this.drawDatasetLabel();
  }

  mapY(value, minValue, maxValue) {
    return map(value, minValue, maxValue, this.height * 0.8, this.height * 0.2);
  }

  axes(numDataPoints) {
    line(this.yAxisOffset, this.height * 0.1, this.yAxisOffset, this.height * 0.88);
    line(this.yAxisOffset, this.height * 0.88, this.width - 40, this.height * 0.88);

    for (let i = 0; i <= 3; i++) {
      let yPosition = map(i, 0, 3, this.height * 0.8, this.height * 0.2);
      textAlign(RIGHT, CENTER);
      textSize(12);
      text(i, this.yAxisOffset - 10, yPosition);
    }

    for (let i = 0; i < numDataPoints; i++) {
      let xPosition = this.yAxisOffset + (this.width - this.yAxisOffset - 40) * (i / (numDataPoints - 1));
      line(xPosition, this.height * 0.88, xPosition, this.height * 0.9);
    }
  }

  labels() {
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Day of Month", this.width / 2, this.height * 0.95);
    textSize(20);
    text("Data Visualization", this.width / 2, this.height * 0.05);

    textAlign(CENTER, CENTER);
    push();
    translate(this.yAxisOffset - 30, this.height / 2);
    rotate(PI * 1.5);
    textSize(16);
    text("Value", 0, 0);
    pop();
  }

  drawDays(numDataPoints) {
    let dataToDraw = this.data[this.currentDataset];
    for (let i = 0; i < numDataPoints; i++) {
      let xPosition = this.yAxisOffset + (this.width - this.yAxisOffset - 40) * (i / (numDataPoints - 1));
      textAlign(CENTER, CENTER);
      textSize(12);
      text(i + 1, xPosition, this.height * 0.91);
    }
  }

  drawDatasetLabel() {
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.currentDataset.toUpperCase(), this.width / 2, this.height * 0.1);
  }

  keyPressed() {
    if (key === 'n' || key === 'N') this.currentDataset = 'nov';
    else if (key === 'd' || key === 'D') this.currentDataset = 'dec';
    else if (key === 'j' || key === 'J') this.currentDataset = 'jan';
    else if (key === 'f' || key === 'F') this.currentDataset = 'feb';
    redraw();
  }
}

let dataViz;

function preload() {
  dataViz = new DataVisualization();
  dataViz.addData('nov', [1, 2, 3, 4, 2, 3, 1, 0, 5, 3, 2, 4, 1, 0, 2, 1, 0, 3, 2, 4, 5, 0, 0, 3, 1, 0, 2, 4, 0, 3, 2]);
  dataViz.addData('dec', [2, 3, 1, 4, 2, 0, 3, 5, 1, 4, 3, 0, 4, 1, 3, 2, 5, 4, 1, 2, 0, 3, 1, 4, 0, 3, 2, 0, 1, 3, 4]);
  dataViz.addData('jan', [1, 2, 1, 0, 3, 4, 2, 1, 3, 2, 4, 1, 0, 0, 2, 3, 4, 1, 3, 2, 0, 1, 3, 2, 4, 0, 3, 1, 2, 4, 1]);
  dataViz.addData('feb', [2, 3, 4, 1, 2, 0, 3, 1, 4, 5, 3, 2, 4, 3, 1, 0, 2, 3, 1, 4, 0, 3, 2, 0, 1, 5, 4, 3, 2, 0, 1]);
}

function setup() {
  dataViz.setup();
}

function draw() {
  dataViz.draw();
}

function keyPressed() {
  dataViz.keyPressed();
}
