function Slider(x1, y1, up1, to1, staart, Xlength, drag) {
  this.x = x1
  this.y = y1
  this.up = up1
  this.to = to1
  this.Xlength = Xlength
  this.width = this.Xlength
  this.strokeWeight = 3
  this.col = [0, 0, 0, 255]
  this.slider = {
    x: map(staart, up1, to1, 0, Xlength),
    value: staart,
    r: 10,
    col: [255, 255, 255, 255],
    stroke: [0, 0, 0, 255]
  }
  this.sliding = false
  this.value = staart
  this.text = true
  this.notes = true
  this.textcol = [151, 151, 151, 255]
  this.draganddrop = drag || false
  this.dragrect = {
    x: 0,
    y: -this.slider.r - 5,
    r: 5,
    filling: true,
    col: [255, 255, 255, 255],
    stroking: false,
    strokecol: [0, 255, 0, 255],
    drags: false
  }

  this.update = function() {
    var d = dist(this.x + this.slider.x, this.y, mouseX, mouseY)
    if (d <= this.slider.r) {
      if (mouseIsPressed) {
        this.sliding = true
      }
    }
    if (this.sliding) {
      if (mouseIsPressed) {
        if (mouseX >= this.x && mouseX <= this.x + this.Xlength) {
          this.value = map(mouseX - this.x, 0, this.Xlength, this.up, this.to)
          this.change()
        }
      } else {
        this.sliding = false
      }
    }
    this.slider.x = map(this.value, this.up, this.to, 0, this.Xlength)
    if (this.draganddrop && !this.sliding) {
      var d = dist(this.x + this.dragrect.x, this.y + this.dragrect.y, mouseX, mouseY)
      if (d <= this.dragrect.r) {
        if (mouseIsPressed) {
          this.dragrect.drags = true
        }
      }
      if (this.dragrect.drags) {
        if (mouseIsPressed) {
          this.x = mouseX - this.dragrect.x
          this.y = mouseY - this.dragrect.y
        } else {
          this.dragrect.drags = false
        }
      }
    }
  }

  this.disp = function() {
    stroke(this.col[0], this.col[1], this.col[2], this.col[3])
    strokeWeight(this.strokeWeight)
    line(this.x, this.y, this.x + this.Xlength, this.y)
    if (this.draganddrop) {
      if (this.dragrect.filling) {
        fill(this.dragrect.col[0], this.dragrect.col[1], this.dragrect.col[2], this.dragrect.col[3])
      } else {
        noFill()
      }
      if (this.dragrect.stroking) {
        stroke(this.dragrect.strokecol[0], this.dragrect.strokecol[1], this.dragrect.strokecol[2], this.dragrect.strokecol[3])
      } else {
        noStroke()
      }
      ellipse(this.x + this.dragrect.x, this.y + this.dragrect.y, this.dragrect.r * 2, this.dragrect.r * 2)
      stroke(0)
      strokeWeight(1)
      line(this.x + this.dragrect.x, this.y + this.dragrect.y - (this.dragrect.r / 2),
           this.x + this.dragrect.x, this.y + this.dragrect.y + (this.dragrect.r / 2))
      line(this.x + this.dragrect.x - (this.dragrect.r / 2), this.y + this.dragrect.y,
           this.x + this.dragrect.x + (this.dragrect.r / 2), this.y + this.dragrect.y)
    }
    if (this.notes) {
      fill(this.textcol[0], this.textcol[1], this.textcol[2], this.textcol[3])
      noStroke()
      textSize(this.slider.r * (2 / 3))
      textAlign(LEFT, TOP)
      text(this.up, this.x, this.y + this.slider.r * (1 / 3))
      textAlign(RIGHT, TOP)
      text(this.to, this.x + this.Xlength, this.y + this.slider.r * (1 / 3))
    }
    fill(this.slider.col[0], this.slider.col[1], this.slider.col[2], this.slider.col[3])
    stroke(this.slider.stroke[0], this.slider.stroke[1], this.slider.stroke[2], this.slider.stroke[3])
    strokeWeight(1)
    ellipse(this.x + this.slider.x, this.y, this.slider.r * 2, this.slider.r * 2)
    if (this.text) {
      fill(this.textcol[0], this.textcol[1], this.textcol[2], this.textcol[3])
      noStroke()
      textSize(this.slider.r * (2 / 3))
      textAlign(CENTER, CENTER)
      text(round(this.value), this.x + this.slider.x, this.y)
    }
  }

  this.change = function() {

  }
}
