var dungeon, buttons
var pause = false
var animations

function setup() {
  createCanvas(windowWidth, windowHeight)
  animations = []
  dungeon = new Dungeon()
  dungeon.setup(10)
  buttons = new Buttons()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (!pause) {
    dungeon.update()
    dungeon.disp()
  }
  buttons.disp()
  for (i = 0; i < animations.length; i++) {
    animations[i].disp()
  }
}

function mouseWheel(event) {
  if (!pause) {
    dungeon.zoom -= (event.delta / 10000)
    dungeon.fixedview = true
  }
}

function mousePressed() {
  if (buttons.within1(mouseX, mouseY)) {
    fullscreen(!fullscreen())
  } else if (buttons.within2(mouseX, mouseY)) {
    pause = !pause
  } else if (!pause && !keyIsDown(16)) {
    dungeon.player.shoot()
  }
}

function Buttons() {
  this.factor = 30

  this.within1 = function(x, y) {
    if (x >= this.x1 - (this.factor1 / 6) && y >= this.y1 - (this.factor1 / 6) && x <= this.x1 - (this.factor1 / 6) + (this.factor1 * (8 / 6)) && y <= this.y1 - (this.factor1 / 6) + (this.factor1 * (8 / 6))) {
      return true
    } else {
      return false
    }
  }

  this.within2 = function(x, y) {
    if (x >= this.x2 - (this.factor2 / 6) && y >= this.y2 - (this.factor2 / 6) && x <= this.x2 - (this.factor2 / 6) + (this.factor2 * (8 / 6)) && y <= this.y2 - (this.factor2 / 6) + (this.factor2 * (8 / 6))) {
      return true
    } else {
      return false
    }
  }

  this.disp = function() {
    if (pause) {
      fill(255)
      rect(this.x1 - (this.factor1 / 6), this.y1 - (this.factor1 / 6), this.factor1 * (8 / 6), this.factor1 * (8 / 6), this.factor1 / 5)
      rect(this.x2 - (this.factor2 / 6), this.y2 - (this.factor2 / 6), this.factor2 * (8 / 6), this.factor2 * (8 / 6), this.factor2 / 5)
    }
    if (this.within1(mouseX, mouseY)) {
      this.factor1 = 35
    } else {
      this.factor1 = 30
    }
    this.x1 = this.factor1 / 2
    this.y1 = height - (this.factor1 * 1.5)
    fill(220)
    noStroke()
    rect(this.x1 - (this.factor1 / 6), this.y1 - (this.factor1 / 6), this.factor1 * (8 / 6), this.factor1 * (8 / 6), this.factor1 / 5)
    fill(255)
    if (fullscreen()) {
      rect(this.x1, this.y1 + (0.2 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1, this.y1 + (0.6 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1 + (0.2 * this.factor1), this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
      rect(this.x1 + (0.6 * this.factor1), this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
      rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.2 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.6 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1 + (0.2 * this.factor1), this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
      rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
    } else {
      rect(this.x1, this.y1, 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1, this.y1 + (0.8 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1, this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
      rect(this.x1 + (0.8 * this.factor1), this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
      rect(this.x1 + (0.6 * this.factor1), this.y1, 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.8 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
      rect(this.x1, this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
      rect(this.x1 + (0.8 * this.factor1), this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
    }
    if (this.within2(mouseX, mouseY)) {
      this.factor2 = 35
    } else {
      this.factor2 = 30
    }
    this.x2 = this.x1 - (this.factor1 / 6) + (this.factor1 * (8 / 6)) + (this.factor2 / 2)
    this.y2 = height - (this.factor2 * 1.5)
    fill(220)
    noStroke()
    rect(this.x2 - (this.factor2 / 6), this.y2 - (this.factor2 / 6), this.factor2 * (8 / 6), this.factor2 * (8 / 6), this.factor2 / 5)
    fill(255)
    if (!pause) {
      rect(this.x2 + (0.2 * this.factor2), this.y2 + (0.2 * this.factor2), this.factor2 * 0.2, this.factor2 * 0.6)
      rect(this.x2 + (0.6 * this.factor2), this.y2 + (0.2 * this.factor2), this.factor2 * 0.2, this.factor2 * 0.6)
    } else {
      beginShape()
      vertex(this.x2 + (0.2 * this.factor2), this.y2 + (0.2 * this.factor2));
      vertex(this.x2 + (0.8 * this.factor2), this.y2 + (0.5 * this.factor2));
      vertex(this.x2 + (0.2 * this.factor2), this.y2 + (0.8 * this.factor2));
      endShape(CLOSE)
    }
  }
}
