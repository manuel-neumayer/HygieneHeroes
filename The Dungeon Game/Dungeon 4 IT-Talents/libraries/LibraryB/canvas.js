function Canvas(x, y, w, h, draganddrop, closebutton, sizeadjust, filling, fillcol, stroking, colstroke, sw) {
  this.x = x || 0
  this.y = y || 0
  this.width = w || 500
  this.height = h || 500
  this.draganddrop = draganddrop || false
  this.dragrect = {
    x: 0,
    y: 0,
    r: 5,
    filling: true,
    col: [255, 255, 255, 255],
    stroking: false,
    strokecol: [0, 255, 0, 255],
    drags: false,
    outside: true
  }
  this.closebutton = closebutton || false
  this.closed = false
  this.closerect = {
    x: 0,
    y: 10,
    r: 5,
    filling: true,
    col: [255, 255, 255, 255],
    stroking: false,
    strokecol: [0, 255, 0, 255]
  }
  this.sizeadjust = sizeadjust || false
  this.sizerect = {
    x: this.width,
    y: this.height,
    r: 5,
    filling: true,
    col: [255, 255, 255, 255],
    stroking: false,
    strokecol: [0, 255, 0, 255],
    drags: false
  }
  this.graphs = {
    active: false,
    x0: 0.1,
    x1: 0.9,
    y0: 0.1,
    y1: 0.9,
    Ys: [],
    Xlength: 0,
    Ymax: 0,
    Ymin: 0,
    cols: [],
    strokeweights: [],
    lines: true,
    all: true,
    inscription: true,
    inscriptioncol: [255, 255, 255, 255],
    textsize: 1,
    texts: [],
    textvalue: true
  }
  this.charts = {
    active: false,
    x0: 0.1,
    x1: 0.9,
    y0: 0.1,
    y1: 0.9,
    Ys: [],
    Xlength: 0,
    Xdistance: 0,
    distancesize: 1,
    Ymax: 0,
    Ymin: 0,
    cols: [],
    lines: true,
    inscription: true,
    inscriptioncol: [255, 255, 255, 255],
    textsize: 1,
    texts: [],
    textvalue: true
  }
  this.piecharts = {
    active: false,
    x1: 0.5,
    y1: 0.5,
    r1: 0.75,
    x: 0,
    y: 0,
    r: 0,
    Ps: [],
    cols: [],
    backgroundcol: [0, 0, 0],
    strokeweight: 1,
    inscription: true,
    inscriptioncol: [255, 255, 255, 255],
    textsize: 1,
    texts: [],
    innercircle: false,
    innerR: 1,
    textvalue: true
  }
  this.areacharts = {
    active: false,
    x0: 0.1,
    x1: 0.9,
    y0: 0.1,
    y1: 0.9,
    Ps: [],
    areas: [],
    Xlength: 0,
    cols: [],
    strokeweight: 0,
    lines: true,
    inscription: true,
    inscriptioncol: [255, 255, 255, 255],
    textsize: 1,
    texts: [],
    textvalue: true
  }
  this.consoles = {
    active: false,
    texts: [],
    textsize: 0,
    textsizes: [],
    col: 0,
    cols: [],
    para: 0,
    paras: [],
    scroll: true,
    high: 0,
    scrolled: 0
  }
  this.oscillators = {
    active: false,
    x0: 0.05,
    x1: 1,
    y0: 0.1,
    y1: 0.9,
    Ps: [],
    Ys: [],
    Xlength: 1,
    changeXlength: true,
    chosenXlength: 250,
    Xx: 0.05,
    drags: false,
    average: 0,
    Ymax: 0,
    Ymin: 0,
    col: [255, 255, 255, 255],
    r: 1,
    rad: 0,
    lines: true,
    inscription: 2,
    abs: 2.25,
    inscriptioncol: [255, 255, 255, 255],
    textsize: 1
  }
  if (typeof(filling) !== "undefined") {
    if (filling) {
      this.filling = true
      if (typeof(fillcol) !== "undefined") {
        this.col = fillcol
      } else {
        this.col = [0, 0, 0, 255]
      }
    } else {
      this.filling = false
    }
  } else {
    this.filling = true
    this.col = [0, 0, 0, 255]
  }
  if (typeof(stroking) !== "undefined") {
    if (stroking) {
      this.stroking = true
      if (typeof(colstroke) !== "undefined") {
        this.strokecol = colstroke
      } else {
        this.strokecol = [170, 170, 170, 255]
      }
      if (typeof(sw) !== "undefined") {
        this.strokeweight = sw
      } else {
        this.strokeweight = 1
      }
    } else {
      this.stroking = false
    }
  } else {
    this.stroking = true
    this.strokecol = [170, 170, 170, 255]
    this.strokeweight = 1
  }
  this.frame = 0
  this.corner1 = createVector(this.x, this.y)
  this.corner2 = createVector(this.x + this.width, this.y)
  this.corner3 = createVector(this.x, this.y + this.height)
  this.corner4 = createVector(this.x + this.width, this.y + this.height)
  this.x1 = this.x + this.width
  this.y1 = this.y + this.height

  this.update = function() {
    if (!this.sizerect.drags) {
      if (this.draganddrop) {
        var d = dist(this.x + this.dragrect.x, this.y + this.dragrect.y, mouseX, mouseY)
        if (d <= this.dragrect.r) {
          if (mouseIsPressed && !this.dragrect.outside) {
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
      if (mouseIsPressed && d > this.dragrect.r) {
        this.dragrect.outside = true
      } else if (d <= this.dragrect.r && !mouseIsPressed) {
        this.dragrect.outside = false
      }
    }

    if (this.closebutton) {
      if (!this.sizerect.drags) {
        var d = dist(this.x + this.closerect.x, this.y + this.closerect.y, mouseX, mouseY)
        if (d <= this.closerect.r) {
          if (mouseIsPressed) {
            if (this.closed) {
              if (frameCount > this.frame + 15) {
                this.closed = false
                this.frame = frameCount
              }
            } else {
              if (frameCount > this.frame + 15) {
                this.closed = true
                this.frame = frameCount
              }
            }
          }
        }
      }
    }

    if (this.sizeadjust) {
      if (!this.closed) {
        var d = dist(this.x + this.sizerect.x, this.y + this.sizerect.y, mouseX, mouseY)
        if (d <= this.sizerect.r) {
          if (mouseIsPressed) {
            this.sizerect.drags = true
          }
        }
        if (this.sizerect.drags) {
          if (mouseIsPressed) {
            if (mouseX > this.x) {
              this.width = mouseX - this.x
              this.sizerect.x = this.width
            }
            if (mouseY > this.y) {
              this.height = mouseY - this.y
              this.sizerect.y = this.height
            }
          } else {
            this.sizerect.drags = false
          }
        }
      }
    }

    if (this.graphs.active) {
      var Ymaxes = []
      var Ymins = []
      var Xlengths = []
      for (i1 = 0; i1 < this.graphs.Ys.length; i1++) {
        if (typeof(this.graphs.Ys[i1][0]) === "text") {
          this.graphs.texts[i1] = this.graphs.Ys[i1][0]
          if (typeof(this.graphs.Ys[i1][1]) === "array") {
            this.graphs.cols[i1] = this.graphs.Ys[i1][1]
          }
        }
        Xlengths.push(((this.width * (this.graphs.x1 - this.graphs.x0)) / (this.graphs.Ys[i1].length - 1)))
        for (i2 = 0; i2 < this.graphs.Ys[i1].length; i2++) {
          if (i2 === 0) {
            Ymaxes.push(this.graphs.Ys[i1][i2])
          } else if (this.graphs.Ys[i1][i2] > Ymaxes[i1]) {
            Ymaxes[i1] = this.graphs.Ys[i1][i2]
          }
          if (i2 === 0) {
            Ymins.push(this.graphs.Ys[i1][i2])
          } else if (this.graphs.Ys[i1][i2] < Ymins[i1]) {
            Ymins[i1] = this.graphs.Ys[i1][i2]
          }
        }
      }
      for (i1 = 0; i1 < Ymaxes.length; i1++) {
        if (i1 === 0) {
          var Ymax = Ymaxes[i1]
        } else if (Ymaxes[i1] > Ymax) {
          Ymax = Ymaxes[i1]
        }
      }
      for (i1 = 0; i1 < Ymins.length; i1++) {
        if (i1 === 0) {
          var Ymin = Ymins[i1]
        } else if (Ymins[i1] < Ymin) {
          Ymin = Ymins[i1]
        }
      }
      for (i1 = 0; i1 < Xlengths.length; i1++) {
        if (i1 === 0) {
          var Xlength = Xlengths[i1]
        } else if (Xlengths[i1] < Xlength) {
          Xlength = Xlengths[i1]
        }
      }
      this.graphs.Ymax = Ymax
      this.graphs.Ymin = Ymin
      this.graphs.Xlength = Xlength
    }

    if (this.charts.active) {
      var Xdistance = ((this.width * (this.charts.x1 - this.charts.x0)) / this.charts.Ys.length) / (5 / this.charts.distancesize)
      var Xlength = ((this.width * (this.charts.x1 - this.charts.x0)) - ((this.charts.Ys.length + 1) * Xdistance)) / this.charts.Ys.length
      for (i1 = 0; i1 < this.charts.Ys.length; i1++) {
        if (i1 === 0) {
          var Ymax = this.charts.Ys[i1]
        } else if (this.charts.Ys[i1] > Ymax) {
          Ymax = this.charts.Ys[i1]
        }
        if (i1 === 0) {
          var Ymin = this.charts.Ys[i1]
        } else if (this.charts.Ys[i1] < Ymin) {
          Ymin = this.charts.Ys[i1]
        }
      }

      this.charts.Xdistance = Xdistance
      this.charts.Xlength = Xlength
      this.charts.Ymax = Ymax
      this.charts.Ymin = Ymin
    }

    if (this.piecharts.active) {
      this.piecharts.x = this.x + (this.width * this.piecharts.x1)
      this.piecharts.y = this.y + (this.height * this.piecharts.y1)
      if (this.width > this.height) {
        this.piecharts.r = this.piecharts.r1 * (this.height / 2)
      } else {
        this.piecharts.r = this.piecharts.r1 * (this.width / 2)
      }
    }

    if (this.areacharts.active) {
      this.areacharts.areas = []
      this.areacharts.Xlength = (this.width * (this.areacharts.x1 - this.areacharts.x0)) / (this.areacharts.Ps.length - 1)
      //[[0.25, 0.2, 0.25, 0.3], [0.3, 0.25, 0.2, 0.25], [0.25, 0.3, 0.2, 0.25]] == [[t1 ratios], [t2 ratios], [t3 ratios]]
      var chartheight = this.height * (this.areacharts.y1 - this.areacharts.y0)
      //i1 = number of single graphs/graphareas
      for (i1 = 0; i1 < this.areacharts.Ps[0].length; i1++) {
        this.areacharts.areas.push([])
        this.areacharts.areas[i1].push([])
        this.areacharts.areas[i1].push([])
        //i2 = number of timecoordinates
        for (i2 = 0; i2 < this.areacharts.Ps.length; i2++) {
          if (i1 === 0) {
            this.areacharts.areas[i1][0].push(0)
            this.areacharts.areas[i1][1].push(chartheight * this.areacharts.Ps[i2][i1])
            //NICHT WEGLÖSCHEN!!!
          //} else if (i1 == this.areacharts.Ps[0].length - 1) {
            //this.areacharts.areas[i1][0].push(chartheight * (1 - this.areacharts.Ps[i2][i1]))
            //this.areacharts.areas[i1][1].push(chartheight)
          } else {
            var begin = 0
            for (i3 = 0; i3 < i1; i3++) {
              begin += this.areacharts.Ps[i2][i3]
            }
            begin *= chartheight
            this.areacharts.areas[i1][0].push(begin)
            this.areacharts.areas[i1][1].push(begin + (chartheight * this.areacharts.Ps[i2][i1]))
          }
        }
      }
    }

    if (this.oscillators.active) {
      this.oscillators.Ps.push(this.oscillate())
      this.oscillators.Ys = []
      for (i1 = 0; i1 < this.oscillators.Ps.length; i1++) {
        var y = this.y + this.height - map(this.oscillators.Ps[i1], this.oscillators.Ymin, this.oscillators.Ymax, this.height * this.oscillators.y0, this.height * this.oscillators.y1)
        if (y < this.y + this.oscillators.rad) {
          y = this.y + this.oscillators.rad
        } else if (y > this.y + this.height - this.oscillators.rad) {
          y = this.y + this.height - this.oscillators.rad
        }
        this.oscillators.Ys.push(y)
      }
      this.oscillators.rad = (this.height / (85 / this.oscillators.r))
    }

    this.corner1 = createVector(this.x, this.y)
    this.corner2 = createVector(this.x + this.width, this.y)
    this.corner3 = createVector(this.x, this.y + this.height)
    this.corner4 = createVector(this.x + this.width, this.y + this.height)
  }

  this.disp = function() {
    rectMode(CORNER)
    if (!this.closed) {
      if (this.filling) {
        fill(this.col[0], this.col[1], this.col[2], this.col[3])
      } else {
        noFill()
      }
      if (this.stroking) {
        stroke(this.strokecol[0], this.strokecol[1], this.strokecol[2], this.strokecol[3])
        strokeWeight(this.strokeweight)
      } else {
        noStroke()
      }
      rect(this.x, this.y, this.width, this.height)
    }

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

    if (this.closebutton) {
      if (this.closerect.filling) {
        fill(this.closerect.col[0], this.closerect.col[1], this.closerect.col[2], this.closerect.col[3])
      } else {
        noFill()
      }
      if (this.closerect.stroking) {
        stroke(this.closerect.strokecol[0], this.closerect.strokecol[1], this.closerect.strokecol[2], this.closerect.strokecol[3])
      } else {
        noStroke()
      }
      ellipse(this.x + this.closerect.x, this.y + this.closerect.y, this.closerect.r * 2, this.closerect.r * 2)
      stroke(0)
      strokeWeight(1)
      line(this.x + this.closerect.x - (this.closerect.r / 2), this.y + this.closerect.y,
           this.x + this.closerect.x + (this.closerect.r / 2), this.y + this.closerect.y)
    }

    if (!this.closed) {
      if (this.sizeadjust) {
        if (this.sizerect.filling) {
          fill(this.sizerect.col[0], this.sizerect.col[1], this.sizerect.col[2], this.sizerect.col[3])
        } else {
          noFill()
        }
        if (this.sizerect.stroking) {
          stroke(this.sizerect.strokecol[0], this.sizerect.strokecol[1], this.sizerect.strokecol[2], this.sizerect.strokecol[3])
        } else {
          noStroke()
        }
        ellipse(this.x + this.sizerect.x, this.y + this.sizerect.y, this.sizerect.r * 2, this.sizerect.r * 2)
        stroke(0)
        strokeWeight(1)
        line(this.x + this.sizerect.x - (this.sizerect.r / 2), this.y + this.sizerect.y - (this.sizerect.r / 2),
            this.x + this.sizerect.x + (this.sizerect.r / 2), this.y + this.sizerect.y + (this.sizerect.r / 2))
      }

      if (this.graphs.active) {
        if (this.graphs.lines) {
          for (i2 = 1; i2 < this.graphs.Ys[0].length; i2++) {
            var x1 = this.x + (this.width * this.graphs.x0) + (i2 * this.graphs.Xlength)
            stroke(this.graphs.inscriptioncol[0], this.graphs.inscriptioncol[1], this.graphs.inscriptioncol[2], 50)
            strokeWeight(1)
            line(x1, this.y + this.height - (this.height * this.graphs.y0), x1, this.y + this.height - (this.height * this.graphs.y1))
          }
          if (this.graphs.all) {
            if (this.graphs.Ymin < 0) {
              for (i1 = this.graphs.Ymin; i1 <= this.graphs.Ymax; i1++) {
                var x0 = this.x + (this.width * this.graphs.x0)
                var x1 = this.x + (this.width * this.graphs.x0) + (this.width * (this.graphs.x1 - this.graphs.x0))
                var y = this.y + this.height - (this.height * this.graphs.y0) - map(i1, this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                stroke(this.graphs.inscriptioncol[0], this.graphs.inscriptioncol[1], this.graphs.inscriptioncol[2], 50)
                line(x0, y, x1, y)
              }
            } else {
              for (i1 = 0; i1 <= this.graphs.Ymax; i1++) {
                var x0 = this.x + (this.width * this.graphs.x0)
                var x1 = this.x + (this.width * this.graphs.x0) + (this.width * (this.graphs.x1 - this.graphs.x0))
                var y = this.y + this.height - (this.height * this.graphs.y0) - map(i1, 0, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                stroke(this.graphs.inscriptioncol[0], this.graphs.inscriptioncol[1], this.graphs.inscriptioncol[2], 50)
                line(x0, y, x1, y)
              }
            }
          } else {
            for (i1 = this.graphs.Ymin; i1 <= this.graphs.Ymax; i1++) {
              var x0 = this.x + (this.width * this.graphs.x0)
              var x1 = this.x + (this.width * this.graphs.x0) + (this.width * (this.graphs.x1 - this.graphs.x0))
              var y = this.y + this.height - (this.height * this.graphs.y0) - map(i1, this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              stroke(this.graphs.inscriptioncol[0], this.graphs.inscriptioncol[1], this.graphs.inscriptioncol[2], 50)
              line(x0, y, x1, y)
            }
          }
          stroke(this.graphs.inscriptioncol[0], this.graphs.inscriptioncol[1], this.graphs.inscriptioncol[2], 255)
          line(x0, this.y + this.height - (this.height * this.graphs.y0), x0, this.y + this.height - (this.height * this.graphs.y1))
        }
        for (i1 = 0; i1 < this.graphs.Ys.length; i1++) {
          for (i2 = 1; i2 < this.graphs.Ys[i1].length; i2++) {
            var x0 = this.x + (this.width * this.graphs.x0) + ((i2 - 1) * this.graphs.Xlength)
            if (!this.graphs.all) {
              var y0 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2 - 1], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
            } else {
              if (this.graphs.Ymin < 0) {
                var y0 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2 - 1], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              } else {
                var y0 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2 - 1], 0, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              }
            }
            var x1 = this.x + (this.width * this.graphs.x0) + (i2 * this.graphs.Xlength)
            if (!this.graphs.all) {
              var y1 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
            } else {
              if (this.graphs.Ymin < 0) {
                var y1 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              } else {
                var y1 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2], 0, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              }
            }
            stroke(this.graphs.cols[i1][0], this.graphs.cols[i1][1], this.graphs.cols[i1][2], 75)
            strokeWeight(this.graphs.strokeweights[i1])
            stroke(this.graphs.cols[i1][0], this.graphs.cols[i1][1], this.graphs.cols[i1][2], this.graphs.cols[i1][3])
            line(x0, y0, x1, y1)
          }
        }
        if (this.graphs.inscription) {
          textAlign(RIGHT)
          for (i1 = 0; i1 < this.graphs.Ys.length; i1++) {
            for (i2 = 1; i2 < this.graphs.Ys[i1].length; i2++) {
              if (!this.graphs.all) {
                var y0 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2 - 1], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              } else {
                if (this.graphs.Ymin < 0) {
                  var y0 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2 - 1], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                } else {
                  var y0 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2 - 1], 0, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                }
              }
              var x1 = this.x + (this.width * this.graphs.x0) + (i2 * this.graphs.Xlength)
              if (!this.graphs.all) {
                var y1 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              } else {
                if (this.graphs.Ymin < 0) {
                  var y1 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2], this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                } else {
                  var y1 = this.y + this.height - (this.height * this.graphs.y0) - map(this.graphs.Ys[i1][i2], 0, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                }
              }
              if (i2 == this.graphs.Ys[i1].length - 1) {
                textSize((this.height * (this.graphs.y1 - this.graphs.y0)) / ((this.graphs.texts.length / this.graphs.textsize) * 4))
                fill(this.graphs.inscriptioncol[0], this.graphs.inscriptioncol[1], this.graphs.inscriptioncol[2], this.graphs.inscriptioncol[3])
                noStroke()
                if (this.graphs.textvalue) {
                  text(this.graphs.texts[i1] + " (" + roundNumber(this.graphs.Ys[i1][this.graphs.Ys[i1].length - 1], 5) + ")", x1, y1)
                } else {
                  text(this.graphs.texts[i1], x1, y1)
                }
              }
            }
          }
          textSize((((this.height * (this.graphs.y1 - this.graphs.y0)) / this.graphs.Ymax)) * this.graphs.textsize)
          textAlign(RIGHT)
          if (this.graphs.all) {
            if (this.graphs.Ymin < 0) {
              for (i1 = floor(this.graphs.Ymin); i1 <= this.graphs.Ymax; i1++) {
                var x = this.x + (this.width * this.graphs.x0) - (textSize() / 3)
                var y = this.y + this.height - (this.height * this.graphs.y0) - map(i1, this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                text(i1, x, y)
              }
            } else {
              for (i1 = 0; i1 <= this.graphs.Ymax; i1++) {
                var x = this.x + (this.width * this.graphs.x0) - (textSize() / 3)
                var y = this.y + this.height - (this.height * this.graphs.y0) - map(i1, 0, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
                text(i1, x, y)
              }
            }
          } else {
            for (i1 = floor(this.graphs.Ymin); i1 <= this.graphs.Ymax; i1++) {
              var x = this.x + (this.width * this.graphs.x0) - (textSize() / 3)
              var y = this.y + this.height - (this.height * this.graphs.y0) - map(i1, this.graphs.Ymin, this.graphs.Ymax, 0, this.height * (this.graphs.y1 - this.graphs.y0))
              text(i1, x, y)
            }
          }
        }
      }

      if (this.charts.active) {
        if (this.charts.lines) {
          stroke(this.charts.inscriptioncol[0], this.charts.inscriptioncol[1], this.charts.inscriptioncol[2], 50)
          if (this.charts.Ymin < 0 && this.charts.Ymax > 0) {
            for (i1 = this.charts.Ymin; i1 <= this.charts.Ymax; i1++) {
              var y = this.y + this.height - (this.height * this.charts.y0) - map(i1, this.charts.Ymin, this.charts.Ymax, 0, this.height * (this.charts.y1 - this.charts.y0))
              line(this.x + (this.width * this.charts.x0), y, this.x + (this.width * this.charts.x1), y)
            }
          } else if (this.charts.Ymin >= 0 && this.charts.Ymax >= 0) {
            for (i1 = 0; i1 <= this.charts.Ymax; i1++) {
              var y = this.y + this.height - (this.height * this.charts.y0) - map(i1, 0, this.charts.Ymax, 0, this.height * (this.charts.y1 - this.charts.y0))
              line(this.x + (this.width * this.charts.x0), y, this.x + (this.width * this.charts.x1) , y)
            }
          } else if (this.charts.Ymin <= 0 && this.charts.Ymax <= 0) {
            for (i1 = 0; i1 >= this.charts.Ymin; i1--) {
              var y = this.y + this.height - (this.height * this.charts.y1) + map(i1, 0, this.charts.Ymin, 0, this.height * (this.charts.y1 - this.charts.y0))
              line(this.x + (this.width * this.charts.x0), y, this.x + (this.width * this.charts.x1) , y)
            }
          }
        }
        for (i1 = 0; i1 < this.charts.Ys.length; i1++) {
          var x = this.x + (this.width * this.charts.x0) + (this.charts.Xdistance) + (i1 * (this.charts.Xlength + this.charts.Xdistance))
          if (this.charts.Ymin < 0 && this.charts.Ymax > 0) {
            var zero = this.height * (this.charts.y1 - this.charts.y0) * (abs(this.charts.Ymin) / (abs(this.charts.Ymin) + abs(this.charts.Ymax)))
            var upheight = this.height * (this.charts.y1 - this.charts.y0) * (abs(this.charts.Ymax) / (abs(this.charts.Ymin) + abs(this.charts.Ymax)))
            if (this.charts.Ys[i1] < 0) {
              var y = this.y + this.height - (this.height * this.charts.y0) - zero
              var height = map(this.charts.Ys[i1], 0, this.charts.Ymin, 0, zero)
            } else {
              var y = this.y + this.height - (this.height * this.charts.y0) - zero - map(this.charts.Ys[i1], 0, this.charts.Ymax, 0, upheight)
              var height = map(this.charts.Ys[i1], 0, this.charts.Ymax, 0, upheight)
            }
          } else if (this.charts.Ymin >= 0 && this.charts.Ymax >= 0) {
            var y = this.y + this.height - (this.height * this.charts.y0) - map(this.charts.Ys[i1], 0, this.charts.Ymax, 0, this.height * (this.charts.y1 - this.charts.y0))
            var height = map(this.charts.Ys[i1], 0, this.charts.Ymax, 0, this.height * (this.charts.y1 - this.charts.y0))
          } else if (this.charts.Ymin <= 0 && this.charts.Ymax <= 0) {
            var y = this.y + this.height - (this.height * this.charts.y1)
            var height = map(this.charts.Ys[i1], 0, this.charts.Ymin, 0, this.height * (this.charts.y1 - this.charts.y0))
          }
          noStroke()
          fill(this.charts.cols[i1][0], this.charts.cols[i1][1], this.charts.cols[i1][2], this.charts.cols[i1][3])
          rect(x, y, this.charts.Xlength, height)
          if (this.charts.inscription) {
            textSize((this.charts.Xlength / 5) * this.charts.textsize)
            fill(this.charts.inscriptioncol[0], this.charts.inscriptioncol[1], this.charts.inscriptioncol[2], this.charts.inscriptioncol[3])
            if (this.charts.Ymin < 0 && this.charts.Ymax > 0) {
              var zero = this.height * (this.charts.y1 - this.charts.y0) * (abs(this.charts.Ymin) / (abs(this.charts.Ymin) + abs(this.charts.Ymax)))
              if (this.charts.Ys[i1] >= 0) {
                textAlign(CENTER, BOTTOM)
                if (this.charts.textvalue) {
                  text(this.charts.texts[i1] + " (" + roundNumber(this.charts.Ys[i1], 5) + ")", x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y0) - zero - (textSize() / 2))
                } else {
                  text(this.charts.texts[i1], x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y0) - zero - (textSize() / 2))
                }
              } else {
                textAlign(CENTER, TOP)
                if (this.charts.textvalue) {
                  text(this.charts.texts[i1] + " (" + roundNumber(this.charts.Ys[i1], 5) + ")", x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y0) - zero + (textSize() / 2))
                } else {
                  text(this.charts.texts[i1], x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y0) - zero + (textSize() / 2))
                }
              }
            } else if (this.charts.Ymin >= 0 && this.charts.Ymax >= 0) {
              textAlign(CENTER, BOTTOM)
              if (this.charts.textvalue) {
                text(this.charts.texts[i1] + " (" + roundNumber(this.charts.Ys[i1], 5) + ")", x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y0) - (textSize() / 2))
              } else {
                text(this.charts.texts[i1], x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y0) - (textSize() / 2))
              }
            } else if (this.charts.Ymin <= 0 && this.charts.Ymax <= 0) {
              textAlign(CENTER, TOP)
              if (this.charts.textvalue) {
                text(this.charts.texts[i1] + " (" + roundNumber(this.charts.Ys[i1], 5) + ")", x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y1) + (textSize() / 2))
              } else {
                text(this.charts.texts[i1], x + (this.charts.Xlength / 2), this.y + this.height - (this.height * this.charts.y1) + (textSize() / 2))
              }
            }
          }
        }
        if (this.charts.lines) {
          stroke(this.charts.inscriptioncol[0], this.charts.inscriptioncol[1], this.charts.inscriptioncol[2], this.charts.inscriptioncol[3])
          strokeWeight(1)
          if (this.charts.Ymin < 0 && this.charts.Ymax > 0) {
            var zero = this.height * (this.charts.y1 - this.charts.y0) * (abs(this.charts.Ymin) / (abs(this.charts.Ymin) + abs(this.charts.Ymax)))
            line(this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y0) - zero, this.x + (this.width * this.charts.x1), this.y + this.height - (this.height * this.charts.y0) - zero)
            line(this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y0), this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y1))
          } else if (this.charts.Ymin >= 0 && this.charts.Ymax >= 0) {
            line(this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y0), this.x + (this.width * this.charts.x1), this.y + this.height - (this.height * this.charts.y0))
            line(this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y0), this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y1))
          } else if (this.charts.Ymin <= 0 && this.charts.Ymax <= 0) {
            line(this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y1), this.x + (this.width * this.charts.x1), this.y + this.height - (this.height * this.charts.y1))
            line(this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y0), this.x + (this.width * this.charts.x0), this.y + this.height - (this.height * this.charts.y1))
          }
        }
        if (this.charts.inscription) {
          fill(this.charts.inscriptioncol[0], this.charts.inscriptioncol[1], this.charts.inscriptioncol[2], this.charts.inscriptioncol[3])
          textSize(((this.height * (this.charts.y1 - this.charts.y0)) / (abs(this.charts.Ymin) + abs(this.charts.Ymax))) * 0.75 * this.charts.textsize)
          if (textSize() > this.height * 0.2) {
            textSize(this.height * 0.2)
          }
          textAlign(RIGHT, CENTER)
          if (this.charts.Ymin < 0 && this.charts.Ymax > 0) {
            for (i1 = floor(this.charts.Ymin); i1 <= this.charts.Ymax; i1++) {
              var x = this.x + (this.width * this.charts.x0) - (textSize() / 5)
              var y = this.y + this.height - (this.height * this.charts.y0) - map(i1, this.charts.Ymin, this.charts.Ymax, 0, this.height * (this.charts.y1 - this.charts.y0))
              text(i1, x, y)
            }
          } else if (this.charts.Ymin >= 0 && this.charts.Ymax >= 0) {
            for (i1 = 0; i1 <= this.charts.Ymax; i1++) {
              var x = this.x + (this.width * this.charts.x0) - (textSize() / 5)
              var y = this.y + this.height - (this.height * this.charts.y0) - map(i1, 0, this.charts.Ymax, 0, this.height * (this.charts.y1 - this.charts.y0))
              text(i1, x, y)
            }
          } else if (this.charts.Ymin <= 0 && this.charts.Ymax <= 0) {
            for (i1 = 0; i1 >= this.charts.Ymin; i1--) {
              var x = this.x + (this.width * this.charts.x0) - (textSize() / 5)
              var y = this.y + this.height - (this.height * this.charts.y1) + map(i1, 0, this.charts.Ymin, 0, this.height * (this.charts.y1 - this.charts.y0))
              text(i1, x, y)
            }
          }
        }
      }

      if (this.piecharts.active) {
        var sum = 0
        for (i1 = 0; i1 < this.piecharts.Ps.length; i1++) {
          sum += this.piecharts.Ps[i1]
        }
        if (sum <= 1) {
          strokeWeight(this.piecharts.r / (1 / (this.piecharts.strokeweight / 40)))
          stroke(this.piecharts.backgroundcol[0], this.piecharts.backgroundcol[1], this.piecharts.backgroundcol[2], 255)
          var gaps = this.piecharts.r / (1 / (this.piecharts.strokeweight / 40))
          for (i1 = 0; i1 < this.piecharts.Ps.length; i1++) {
            fill(this.piecharts.cols[i1][0], this.piecharts.cols[i1][1], this.piecharts.cols[i1][2], this.piecharts.cols[i1][3])
            if (i1 === 0) {
              beginShape()
              vertex(this.piecharts.x, this.piecharts.y + (this.piecharts.r * sin(gaps / 400)))
              for (i2 = gaps / 400; i2 <= (this.piecharts.Ps[i1] * TWO_PI); i2 += 0.01) {
                vertex(this.piecharts.x + (this.piecharts.r * cos(i2)), this.piecharts.y + (this.piecharts.r * sin(i2)))
              }
              endShape()
            } else {
              var begin = 0
              for (i2 = 0; i2 < i1; i2++) {
                begin += (this.piecharts.Ps[i2] * TWO_PI)
              }
              beginShape()
              vertex(this.piecharts.x, this.piecharts.y)
              for (i2 = begin; i2 <= begin + (this.piecharts.Ps[i1] * TWO_PI); i2 += 0.01) {
                vertex(this.piecharts.x + (this.piecharts.r * cos(i2)), this.piecharts.y + (this.piecharts.r * sin(i2)))
              }
              endShape()
            }
          }
        }
        if (this.piecharts.innercircle) {
          fill(this.piecharts.backgroundcol[0], this.piecharts.backgroundcol[1], this.piecharts.backgroundcol[2], 255)
          noStroke()
          ellipse(this.piecharts.x, this.piecharts.y, (this.piecharts.r * this.piecharts.innerR * 0.2) * 2, (this.piecharts.r * this.piecharts.innerR * 0.2) * 2)
        }
        if (this.piecharts.inscription) {
          textSize(this.piecharts.r / (10 / this.piecharts.textsize))
          textAlign(CENTER, CENTER)
          fill(this.piecharts.inscriptioncol[0], this.piecharts.inscriptioncol[1], this.piecharts.inscriptioncol[2], this.piecharts.inscriptioncol[3])
          noStroke()
          for (i1 = 0; i1 < this.piecharts.Ps.length; i1++) {
            if (i1 === 0) {
              var angle = (gaps / 400) + ((this.piecharts.Ps[i1] / 2) * TWO_PI)
              if (this.piecharts.textvalue) {
                text(this.piecharts.texts[i1] + " (" + round(this.piecharts.Ps[i1] * 100) + "%)", this.piecharts.x + ((this.piecharts.r * (2 / 3)) * cos(angle)), this.piecharts.y + ((this.piecharts.r / 2) * sin(angle)))
              } else {
                text(this.piecharts.texts[i1], this.piecharts.x + ((this.piecharts.r / 2) * cos(angle)), this.piecharts.y + ((this.piecharts.r / 2) * sin(angle)))
              }
            } else {
              var begin = 0
              for (i2 = 0; i2 < i1; i2++) {
                begin += (this.piecharts.Ps[i2] * TWO_PI)
              }
              var angle = begin + ((this.piecharts.Ps[i1] / 2) * TWO_PI)
              if (this.piecharts.textvalue) {
                text(this.piecharts.texts[i1] + " (" + round(this.piecharts.Ps[i1] * 100) + "%)", this.piecharts.x + ((this.piecharts.r * (2 / 3)) * cos(angle)), this.piecharts.y + ((this.piecharts.r / 2) * sin(angle)))
              } else {
                text(this.piecharts.texts[i1], this.piecharts.x + ((this.piecharts.r / 2) * cos(angle)), this.piecharts.y + ((this.piecharts.r / 2) * sin(angle)))
              }
            }
          }
        }
      }

      if (this.areacharts.active) {
        //areas == [player[frame(0/1)[timecoordinate]]] ==> this.areacharts.areas[player][frame][timecoordinate]
        for (i1 = 0; i1 < this.areacharts.areas.length; i1++) {
          fill(this.areacharts.cols[i1][0], this.areacharts.cols[i1][1], this.areacharts.cols[i1][2], this.areacharts.cols[i1][3])
          strokeWeight(this.areacharts.strokeweight / (1 / (this.height / 400)))
          stroke(0)
          beginShape()
          for (i2 = 0; i2 < this.areacharts.areas[i1][0].length; i2++) {
            vertex(this.x + (this.width * this.areacharts.x0) + (i2 * this.areacharts.Xlength), this.y + this.height - (this.height * this.areacharts.y0) - this.areacharts.areas[i1][0][i2])
          }
          for (i2 = this.areacharts.areas[i1][1].length - 1; i2 >= 0; i2--) {
            vertex(this.x + (this.width * this.areacharts.x0) + (i2 * this.areacharts.Xlength), this.y + this.height - (this.height * this.areacharts.y0) - this.areacharts.areas[i1][1][i2])
          }
          endShape()
        }
        if (this.areacharts.lines) {
          stroke(this.areacharts.inscriptioncol[0], this.areacharts.inscriptioncol[1], this.areacharts.inscriptioncol[2], this.areacharts.inscriptioncol[3])
          strokeWeight(1)
          line(this.x + (this.width * this.areacharts.x0), this.y + this.height - (this.height * this.areacharts.y0), this.x + (this.width * this.areacharts.x1), this.y + this.height - (this.height * this.areacharts.y0))
          line(this.x + (this.width * this.areacharts.x0), this.y + this.height - (this.height * this.areacharts.y0), this.x + (this.width * this.areacharts.x0), this.y + this.height - (this.height * this.areacharts.y1))
          for (i1 = 0; i1 < this.areacharts.areas[0][0].length; i1++) {
            var x = this.x + (this.width * this.areacharts.x0) + (i1 * this.areacharts.Xlength)
            var y0 = this.y + this.height - (this.height * this.areacharts.y0)
            var y1 = this.y + this.height - (this.height * this.areacharts.y1)
            stroke(this.areacharts.inscriptioncol[0], this.areacharts.inscriptioncol[1], this.areacharts.inscriptioncol[2], 50)
            line(x, y0, x, y1)
          }
        }
        if (this.areacharts.inscription) {
          fill(this.areacharts.inscriptioncol[0], this.areacharts.inscriptioncol[1], this.areacharts.inscriptioncol[2], this.areacharts.inscriptioncol[3])
          noStroke()
          textSize(this.height / (25 / this.areacharts.textsize))
          for (i1 = 0; i1 < this.areacharts.areas.length; i1++) {
            textAlign(RIGHT, CENTER)
            var x = this.x + (this.width * this.areacharts.x0) + ((this.areacharts.areas[0][0].length - 1) * this.areacharts.Xlength) - (textSize() / 2)
            var y0 = this.y + this.height - (this.height * this.areacharts.y0)
            var y1 = (this.areacharts.areas[i1][1][this.areacharts.areas[i1][1].length - 1] - this.areacharts.areas[i1][0][this.areacharts.areas[i1][0].length - 1]) / 2
            var y = y0 - this.areacharts.areas[i1][0][this.areacharts.areas[i1][0].length - 1] - y1
            if (this.areacharts.textvalue) {
              text(this.areacharts.texts[i1] + " (" + round((this.areacharts.Ps[this.areacharts.Ps.length - 1][i1] * 100)) + "%)", x, y)
            } else {
              text(this.areacharts.texts[i1], x, y)
            }
          }
        }
      }

      if (this.consoles.active) {
        var high = this.consoles.textsize * this.consoles.para
        for (i1 = 0; i1 < this.consoles.texts.length; i1++) {
          high += this.consoles.textsizes[i1] + this.consoles.paras[i1]
        }
        var texthigh = map(this.consoles.scrolled, 0, 1, 0, -(high - this.height))
        texthigh += this.consoles.textsize * this.consoles.para
        var seenones = 0
        for (i1 = this.consoles.texts.length - 1; i1 >= 0; i1--) {
          textSize(this.consoles.textsizes[i1])
          fill (this.consoles.cols[i1][0], this.consoles.cols[i1][1], this.consoles.cols[i1][2], this.consoles.cols[i1][3])
          noStroke()
          textAlign(LEFT, BOTTOM)
          var x = this.x + this.consoles.textsize
          var y = this.y + this.height - texthigh
          if (texthigh >= 0 && texthigh <= this.height - textSize()) {
            if (this.consoles.textsize + textWidth(this.consoles.texts[i1]) <= this.width) {
              text(this.consoles.texts[i1], x, y)
              texthigh += textSize() + this.consoles.paras[i1]
            } else {
              text("...", x, y)
              texthigh += textSize() + this.consoles.paras[i1]
            }
            seenones++
          } else if (this.consoles.scroll) {
            texthigh += textSize() + this.consoles.paras[i1]
          } else if (texthigh >= height) {
            this.consoles.texts.splice(i1, 1)
          }
        }
        if (this.consoles.scroll) {
          if (seenones < this.consoles.texts.length) {
            var ratio = seenones / this.consoles.texts.length
            var lngth = ratio * this.height
            var wdth = this.consoles.textsize * (2 / 3)
            var x = this.x + this.width - this.consoles.textsize
            var y = this.y + this.height - (this.consoles.scrolled * (this.height - lngth)) - lngth
            if (mouseIsPressed && mouseX >= x && mouseY >= y && mouseX <= x + wdth && mouseY <= y + lngth) {
              if (this.consoles.mY === false) {
                this.consoles.mY = mouseY
              }
              var newY = y + (mouseY - this.consoles.mY)
              if (newY >= this.y && newY <= this.y + this.height - lngth) {
                y = newY
                this.consoles.mY = mouseY
              }
            } else if (this.consoles.mY !== false && mouseIsPressed){
              var newY = y + (mouseY - this.consoles.mY)
              if (newY >= this.y && newY <= this.y + this.height - lngth) {
                y = newY
                this.consoles.mY = mouseY
              }
            } else {
              this.consoles.mY = false
            }
            fill(this.consoles.col[0], this.consoles.col[1], this.consoles.col[2], this.consoles.col[3])
            noStroke()
            rect(x, y, wdth, lngth)
            if (isNaN(y)) {
              this.consoles.scrolled = 0
            } else {
              this.consoles.scrolled = ((this.height - lngth) - (y - this.y)) / (this.height - lngth)
            }
          } else {
            this.consoles.scrolled = 0
          }
        }
      }

      if (this.oscillators.active) {
        stroke(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], this.oscillators.inscriptioncol[3])
        strokeWeight(1)
        var y = this.y + this.height - map(this.oscillators.average, this.oscillators.Ymin, this.oscillators.Ymax, this.height * this.oscillators.y0, this.height * this.oscillators.y1)
        line(this.x + (this.width * this.oscillators.x0), y, this.x + (this.width * this.oscillators.x1), y)
        if (this.oscillators.lines) {
          stroke(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], 50)
          strokeWeight(1)
          for (i1 = this.oscillators.Ymin; i1 <= this.oscillators.Ymax; i1++) {
            var y = this.y + this.height - (this.height * this.oscillators.y0) - map(i1, this.oscillators.Ymin, this.oscillators.Ymax, 0, this.height * (this.oscillators.y1 - this.oscillators.y0))
            line(this.x + (this.width * this.oscillators.x0), y, this.x + (this.width * this.oscillators.x1), y)
          }
        }
        fill(this.oscillators.col[0], this.oscillators.col[1], this.oscillators.col[2], this.oscillators.col[3])
        noStroke()
        ellipse(this.x + (this.width * this.oscillators.x0) + (this.oscillators.rad * this.oscillators.abs), this.oscillators.Ys[this.oscillators.Ys.length - 1], this.oscillators.rad * 2, this.oscillators.rad * 2)
        stroke(this.oscillators.col[0], this.oscillators.col[1], this.oscillators.col[2], this.oscillators.col[3])
        strokeWeight(1)
        var xnumb = 0
        for (i1 = this.oscillators.Ys.length - 1; i1 > 0; i1--) {
          var x0 = this.x + (this.width * this.oscillators.x0) + (this.oscillators.rad * this.oscillators.abs) + (((this.width * (this.oscillators.x1 - this.oscillators.x0)) / (this.oscillators.chosenXlength * this.oscillators.Xlength)) * xnumb)
          var x1 = this.x + (this.width * this.oscillators.x0) + (this.oscillators.rad * this.oscillators.abs) + (((this.width * (this.oscillators.x1 - this.oscillators.x0)) / (this.oscillators.chosenXlength * this.oscillators.Xlength)) * (xnumb + 1))
          if (x1 <= this.x + (this.width * this.oscillators.x1)) {
            if (this.oscillators.Ys[i1] >= this.y && this.oscillators.Ys[i1] <= this.y + this.height && this.oscillators.Ys[i1 - 1] >= this.y && this.oscillators.Ys[i1 - 1] <= this.y + this.height) {
              line(x0, this.oscillators.Ys[i1], x1, this.oscillators.Ys[i1 - 1])
            }
            xnumb++
          }
        }
        stroke(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], this.oscillators.inscriptioncol[3])
        strokeWeight(1)
        line(this.x + (this.width * this.oscillators.x0), this.y + (this.height * this.oscillators.y0), this.x + (this.width * this.oscillators.x0), this.y + (this.height * this.oscillators.y1))
        if (this.oscillators.inscription === 1) {
          fill(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], this.oscillators.inscriptioncol[3])
          noStroke()
          textSize((this.oscillators.textsize * this.height) / ((this.oscillators.Ymax - this.oscillators.Ymin) * 3))
          textAlign(RIGHT, CENTER)
          for (i1 = this.oscillators.Ymin; i1 <= this.oscillators.Ymax; i1++) {
            var y = this.y + this.height - (this.height * this.oscillators.y0) - map(i1, this.oscillators.Ymin, this.oscillators.Ymax, 0, this.height * (this.oscillators.y1 - this.oscillators.y0))
            text(i1, this.x + (this.width * this.oscillators.x0 * 0.9), y)
          }
        } else if (this.oscillators.inscription === 2) {
          fill(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], this.oscillators.inscriptioncol[3])
          noStroke()
          textSize((this.oscillators.textsize * this.height) / 30)
          textAlign(RIGHT, CENTER)
          text(round(map(this.height - (this.oscillators.Ys[this.oscillators.Ys.length - 1] - this.y), this.height * this.oscillators.y0, this.height * this.oscillators.y1, this.oscillators.Ymin, this.oscillators.Ymax)), this.x + (this.width * this.oscillators.x0 * 0.9), this.oscillators.Ys[this.oscillators.Ys.length - 1])
        } else if (this.oscillators.inscription === 3) {
          fill(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], this.oscillators.inscriptioncol[3])
          noStroke()
          textSize((this.oscillators.textsize * this.height) / ((this.oscillators.Ymax - this.oscillators.Ymin) * 3))
          textAlign(CENTER, BOTTOM)
          text(this.oscillators.Ymax, this.x + (this.width * this.oscillators.x0), this.y + this.height - (this.height * this.oscillators.y1))
          textAlign(CENTER, TOP)
          text(this.oscillators.Ymin, this.x + (this.width * this.oscillators.x0), this.y + this.height - (this.height * this.oscillators.y0))
        }
        if (this.oscillators.changeXlength) {
          stroke(this.oscillators.inscriptioncol[0], this.oscillators.inscriptioncol[1], this.oscillators.inscriptioncol[2], this.oscillators.inscriptioncol[3])
          strokeWeight(1)
          line(this.x + (this.width * this.oscillators.x0) + (this.width / 25), this.y + this.height - (this.height * this.oscillators.y0 * 0.65), this.x + (this.width * this.oscillators.x0) + (this.width / 6), this.y + this.height - (this.height * this.oscillators.y0 * 0.65))
          var x = this.x + (this.width * this.oscillators.x0) + (this.width / 25) + (this.oscillators.Xx * ((this.width / 6) - (this.width / 25)))
          var y = this.y + this.height - (this.height * this.oscillators.y0 * 0.65)
          ellipse(x, y, this.oscillators.rad, this.oscillators.rad)
          if (dist(x, y, mouseX, mouseY) <= this.oscillators.rad / 2 && mouseX >= this.x + (this.width * this.oscillators.x0) + (this.width / 25) && mouseX <= this.x + (this.width * this.oscillators.x0) + (this.width / 6) && mouseIsPressed) {
            this.oscillators.Xx = (mouseX - (x - (this.oscillators.Xx * ((this.width / 6) - (this.width / 25))))) / ((this.width / 6) - (this.width / 25))
            this.oscillators.drags = true
          }
          if (this.oscillators.drags) {
            if (mouseX >= this.x + (this.width * this.oscillators.x0) + (this.width / 25) && mouseX <= this.x + (this.width * this.oscillators.x0) + (this.width / 6) && mouseIsPressed) {
              this.oscillators.Xx = (mouseX - (x - (this.oscillators.Xx * ((this.width / 6) - (this.width / 25))))) / ((this.width / 6) - (this.width / 25))
            } else if (!mouseIsPressed) {
              this.oscillators.drags = false
            }
          }
          if (this.oscillators.Xx < 0.01) {
            this.oscillators.Xx = 0.01
          } else if (this.oscillators.Xx > 1) {
            this.oscillators.Xx = 1
          }
          this.oscillators.chosenXlength = map(this.oscillators.Xx, 0, 1, 0.01, 5000)
        }
      }
    }
  }

  this.graph = function(ys, names, cols, x0, x1, y0, y1) {
    this.graphs.active = true
    this.graphs.Ys = ys
    if (typeof(names) !== "undefined" && typeof(names) !== "number") {
      this.graphs.texts = names
      if (typeof(cols) !== "undefined" && typeof(cols) !== "number") {
        this.graphs.cols = cols
        if (typeof(x0) !== "undefined") {
          this.graphs.x0 = x0
        }
        if (typeof(x1) !== "undefined") {
          this.graphs.x1 = x1
        }
        if (typeof(y0) !== "undefined") {
          this.graphs.y0 = y0
        }
        if (typeof(y1) !== "undefined") {
          this.graphs.y1 = y1
        }
      } else {
        if (typeof(cols) !== "undefined") {
          this.graphs.x0 = cols
        }
        if (typeof(x0) !== "undefined") {
          this.graphs.x1 = x0
        }
        if (typeof(x1) !== "undefined") {
          this.graphs.y0 = x1
        }
        if (typeof(y0) !== "undefined") {
          this.graphs.y1 = y0
        }
      }
    } else {
      if (typeof(names) !== "undefined") {
        this.graphs.x0 = names
      }
      if (typeof(cols) !== "undefined") {
        this.graphs.x1 = cols
      }
      if (typeof(x0) !== "undefined") {
        this.graphs.y0 = x0
      }
      if (typeof(x1) !== "undefined") {
        this.graphs.y1 = x1
      }
    }
    for (i1 = 0; i1 < this.graphs.Ys.length; i1++) {
      if (typeof(names) === "number" || typeof(names) === "undefined") {
        this.graphs.texts.push("")
      }
      if (typeof(cols) === "number" || typeof(cols) === "undefined") {
        this.graphs.cols.push([random(255), random(255), random(255), 255])
      }
      this.graphs.strokeweights.push(1)
    }
  }

  this.pushgraph = function(ys) {
    //Ys = [[grap1Y1, graph1Y2, graph1Y3, graph1Y4], [grap2Y1, graph2Y2, graph2Y3, graph2Y4]]
    //input1 = [[grap1Y1, graph1Y2, graph1Y3, graph1Y4], [grap2Y1, graph2Y2, graph2Y3, graph2Y4]]
    var Ypush = ys
    for (i1 = 0; i1 < Ypush.length; i1++) {
      for (i2 = 0; i2 < Ypush[i1].length; i2++) {
        this.graphs.Ys[i1].push(Ypush[i1][i2])
      }
    }
  }

  this.chart = function(ys, names, cols, x0, x1, y0, y1) {
    this.charts.active = true
    this.charts.Ys = ys
    if (typeof(names) !== "undefined" && typeof(names) !== "number") {
      this.charts.texts = names
      if (typeof(cols) !== "undefined" && typeof(cols) !== "number") {
        this.charts.cols = cols
        if (typeof(x0) !== "undefined") {
          this.charts.x0 = x0
        }
        if (typeof(x1) !== "undefined") {
          this.charts.x1 = x1
        }
        if (typeof(y0) !== "undefined") {
          this.charts.y0 = y0
        }
        if (typeof(y1) !== "undefined") {
          this.charts.y1 = y1
        }
      } else {
        if (typeof(cols) !== "undefined") {
          this.charts.x0 = cols
        }
        if (typeof(x0) !== "undefined") {
          this.charts.x1 = x0
        }
        if (typeof(x1) !== "undefined") {
          this.charts.y0 = x1
        }
        if (typeof(y0) !== "undefined") {
          this.charts.y1 = y0
        }
      }
    } else {
      if (typeof(names) !== "undefined") {
        this.charts.x0 = names
      }
      if (typeof(cols) !== "undefined") {
        this.charts.x1 = cols
      }
      if (typeof(x0) !== "undefined") {
        this.charts.y0 = x0
      }
      if (typeof(x1) !== "undefined") {
        this.charts.y1 = x1
      }
    }
    for (i1 = 0; i1 < this.charts.Ys.length; i1++) {
      if (typeof(names) === "number" || typeof(names) === "undefined") {
        this.charts.texts.push("")
      }
      if (typeof(cols) === "number" || typeof(cols) === "undefined") {
        this.charts.cols.push([random(255), random(255), random(255), 255])
      }
    }
  }

  this.pushchart = function(ys) {
    //input == [value1, value2, value3, value4]
    var Ypush = ys
    for (i1 = 0; i1 < Ypush.length; i1++) {
      this.charts.Ys[i1] += Ypush[i1]
    }
  }

  this.piechart = function(ps, names, cols, x1, y1, r1) {
    this.piecharts.active = true
    this.piecharts.Ps = ps
    if (typeof(names) !== "undefined" && typeof(names) !== "number") {
      this.piecharts.texts = names
      if (typeof(cols) !== "undefined" && typeof(cols) !== "number") {
        this.piecharts.cols = cols
        if (typeof(x1) !== "undefined") {
          this.piecharts.x1 = x1
        }
        if (typeof(y1) !== "undefined") {
          this.piecharts.y1 = y1
        }
        if (typeof(r1) !== "undefined") {
          this.piecharts.r1 = r1
        }
      } else {
        if (typeof(x1) !== "undefined") {
          this.piecharts.x1 = x1
        }
        if (typeof(y1) !== "undefined") {
          this.piecharts.y1 = y1
        }
        if (typeof(r1) !== "undefined") {
          this.piecharts.r1 = r1
        }
      }
    } else {
      if (typeof(x1) !== "undefined") {
        this.piecharts.x1 = x1
      }
      if (typeof(y1) !== "undefined") {
        this.piecharts.y1 = y1
      }
      if (typeof(r1) !== "undefined") {
        this.piecharts.r1 = r1
      }
    }
    for (i1 = 0; i1 < this.piecharts.Ps.length; i1++) {
      if (typeof(names) === "number" || typeof(names) === "undefined") {
        this.piecharts.texts.push("")
      }
      if (typeof(cols) === "number" || typeof(cols) === "undefined") {
        this.piecharts.cols.push([random(255), random(255), random(255), 255])
      }
    }
  }

  this.areachart = function(ps, names, cols, x1, y1, r1) {
    this.areacharts.active = true
    this.areacharts.Ps = ps
    if (typeof(names) !== "undefined" && typeof(names) !== "number") {
      this.areacharts.texts = names
      if (typeof(cols) !== "undefined" && typeof(cols) !== "number") {
        this.areacharts.cols = cols
        if (typeof(x1) !== "undefined") {
          this.areacharts.x1 = x1
        }
        if (typeof(y1) !== "undefined") {
          this.areacharts.y1 = y1
        }
        if (typeof(r1) !== "undefined") {
          this.areacharts.r1 = r1
        }
      } else {
        if (typeof(x1) !== "undefined") {
          this.areacharts.x1 = x1
        }
        if (typeof(y1) !== "undefined") {
          this.areacharts.y1 = y1
        }
        if (typeof(r1) !== "undefined") {
          this.areacharts.r1 = r1
        }
      }
    } else {
      if (typeof(x1) !== "undefined") {
        this.areacharts.x1 = x1
      }
      if (typeof(y1) !== "undefined") {
        this.areacharts.y1 = y1
      }
      if (typeof(r1) !== "undefined") {
        this.areacharts.r1 = r1
      }
    }
    for (i1 = 0; i1 < this.areacharts.Ps[0].length; i1++) {
      if (typeof(names) === "number" || typeof(names) === "undefined") {
        this.areacharts.texts.push("")
      }
      if (typeof(cols) === "number" || typeof(cols) === "undefined") {
        this.areacharts.cols.push([random(255), random(255), random(255), 255])
      }
    }
  }

  this.pusharea = function(ys) {
    //input == [timecoordinate1[player1, player2, player3], timecoordinate2[player1, player2, player3]]
    //Ps == [timecoordinate1[player1, player2, player3], timecoordinate2[player1, player2, player3]]
    var Ypush = ys
    for (i1 = 0; i1 < Ypush.length; i1++) {
      this.areacharts.Ps.push(Ypush[i1])
    }
  }

  this.console = function(ts, col, para, scroll) {
    this.consoles.active = true
    this.consoles.textsize = ts || 12
    if (typeof(col) === "number") {
      this.consoles.col = [255, 255, 255, 255]
      this.consoles.para = col
    } else if (typeof(col) !== "undefined") {
      this.consoles.col = col
      this.consoles.para = para || 0.25
    } else {
      this.consoles.col = [255, 255, 255, 255]
      this.consoles.para = 0.25
    }
    this.consoles.scroll = scroll || false
  }

  this.consolelog = function(tex, ts, col, para) {
    this.consoles.texts.push(tex)
    if (typeof(ts) === "number") {
      this.consoles.textsizes.push(ts)
      if (typeof(col) === "number") {
        this.consoles.cols.push(this.consoles.col)
        this.consoles.paras.push(col)
      } else if (typeof(col) !== "undefined") {
        this.consoles.cols.push(col)
        if (typeof(para) !== "undefined") {
          this.consoles.paras.push(para)
        } else {
          this.consoles.paras.push(this.consoles.textsizes[this.consoles.textsizes.length - 1] * this.consoles.para)
        }
      } else {
        this.consoles.cols.push(this.consoles.col)
        this.consoles.paras.push(this.consoles.textsizes[this.consoles.textsizes.length - 1] * this.consoles.para)
      }
    } else if (typeof(ts) !== "undefined") {
      this.consoles.textsizes.push(this.consoles.textsize)
      this.consoles.cols.push(ts)
      this.consoles.paras.push(this.consoles.textsizes[this.consoles.textsizes.length - 1] * this.consoles.para)
    } else {
      this.consoles.textsizes.push(this.consoles.textsize)
      this.consoles.cols.push(this.consoles.col)
      this.consoles.paras.push(this.consoles.textsizes[this.consoles.textsizes.length - 1] * this.consoles.para)
    }
  }

  this.consoleclear = function() {
    this.consoles.texts = []
    this.consoles.textsizes = []
    this.consoles.cols = []
    this.consoles.paras = []
  }

  this.consolechangetext = function(vartext) {
    this.consoles.texts = vartext
    this.consoles.textsizes = []
    this.consoles.cols = []
    this.consoles.paras = []
    for (i1 = 0; i1 < this.consoles.texts.length; i1++) {
      this.consoles.textsizes.push(this.consoles.textsize)
      this.consoles.cols.push(this.consoles.col)
      this.consoles.paras.push(this.consoles.para)
    }
  }

  this.oscillator = function(thisymin, thisymax, aver, func) {
    this.oscillators.active = true
    this.oscillators.average = aver || 0
    if (typeof(thisymin) !== "undefined") {
      this.oscillators.Ymin = thisymin
    } else {
      this.oscillators.Yim = -100
    }
    if (typeof(thisymax) !== "undefined") {
      this.oscillators.Ymax = thisymax
    } else {
      this.oscillators.Ymax = 100
    }
    if (typeof(func) !== "undefined") {
      this.oscillate = func
    }
  }

  this.oscillate = function() {
    return this.oscillators.average
  }

  this.within = function(x, y) {
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      return true
    } else {
      return false
    }
  }
}
