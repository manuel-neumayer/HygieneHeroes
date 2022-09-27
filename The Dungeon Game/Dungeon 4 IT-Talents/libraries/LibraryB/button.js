function Button(x, y, w, h, tex, texsize, highligh, drag) {
  this.x = x || 0
  this.y = y || 0
  this.clicked = function() {

  }
  if (typeof(w) === "number") {
    this.width = w
    if (typeof(h) === "number") {
      this.height = h
      if (typeof(tex) !== "undefined" && typeof(tex) !== "number") {
        this.text = tex
        if (typeof(texsize) !== "undefined") {
          this.textsize = texsize
        } else {
          this.textsize = this.height / 2
        }
      } else {
        this.text = ""
      }
    } else {
      this.height = 15
    }
  } else if (typeof(w) !== "undefined") {
    this.text = w
    if (typeof(h) === "number") {
      this.textsize = h
    } else if (typeof(h) !== "undefined") {
      this.clicked = h
      this.textsize = 12
    } else {
      this.textsize = 12
    }
    textSize(this.textsize)
    this.width = textWidth(w) * 1.4
    this.height = textSize() * 1.8
  } else {
    this.width = 100
    this.height = 40
    this.text = ""
    this.textsize = 20
  }
  this.highlight = highligh || true
  this.col = [170, 170, 170, 255]
  this.strokecol = [255, 255, 255, 255]
  this.strokeweight = 1
  this.textcol = [0, 0, 0, 255]
  this.pressing = false
  this.pressingoutside = false
  this.clicking = false
  this.draganddrop = drag || false
  this.dragrect = {
    x: 0,
    y: 0,
    r: 5,
    filling: true,
    col: [255, 255, 255, 255],
    stroking: false,
    strokecol: [0, 255, 0, 255],
    drags: false
  }

  this.update = function() {
    if (this.draganddrop) {
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
    if (dist(this.x + this.dragrect.x, this.y + this.dragrect.y, mouseX, mouseY) > this.dragrect.r && !this.dragrect.drags) {
      if (mouseX < this.x || mouseY < this.y || mouseX > this.x + this.width || mouseY > this.y + this.height || !mouseIsPressed) {
        this.pressingoutside = true
      }
      if (this.pressingoutside) {
        if (!mouseIsPressed) {
          this.pressingoutside = false
        }
      }
      if (!this.pressingoutside && mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.width && mouseY <= this.y + this.height && mouseIsPressed) {
        if (!this.clicking) {
          this.clicked()
        }
      }
      if (!this.pressingoutside && mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.width && mouseY <= this.y + this.height && mouseIsPressed) {
        this.clicking = true
      }
      if (this.clicking) {
        if (!mouseIsPressed) {
          this.clicking = false
        }
      }
    }
  }

  this.pressed = function() {
    if (dist(this.x + this.dragrect.x, this.y + this.dragrect.y, mouseX, mouseY) > this.dragrect.r && !this.dragrect.drags) {
      if (!this.pressingoutside && mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.width && mouseY <= this.y + this.height && mouseIsPressed) {
        this.pressing = true
        return true
      }
      if (this.pressing) {
        if (mouseIsPressed) {
          return true
        } else {
          this.pressing = false
          return false
        }
      } else {
        return false
      }
    }
  }

  this.disp = function() {
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

    if (this.highlight) {
      if ((dist(this.x + this.dragrect.x, this.y + this.dragrect.y, mouseX, mouseY) > this.dragrect.r &&
          mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.width && mouseY <= this.y + this.height && !this.dragrect.drags) || this.pressing) {
        fill(this.col[0], this.col[1], this.col[2], 200)
      } else {
        fill(this.col[0], this.col[1], this.col[2], this.col[3])
      }
    } else {
      fill(this.col[0], this.col[1], this.col[2], this.col[3])
    }
    stroke(this.strokecol[0], this.strokecol[1], this.strokecol[2], this.strokecol[3])
    strokeWeight(this.strokeweight)
    rect(this.x, this.y, this.width, this.height)
    fill(this.textcol[0], this.textcol[1], this.textcol[2], this.textcol[3])
    noStroke()
    textSize(this.textsize)
    textAlign(CENTER, CENTER)
    text(this.text, this.x + (this.width / 2), this.y + (this.height / 2) + (textSize() / 10))
  }
}
