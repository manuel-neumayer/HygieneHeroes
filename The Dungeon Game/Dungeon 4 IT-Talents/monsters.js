function Zombie(x, y, size, chamber) {
  this.index = "zombie"
  this.chamber = chamber
  this.x = x
  this.y = y
  this.width = size
  this.height = size / 2
  this.r = size / 3.333
  this.rotation = 0
  this.pointingAt = []
  this.col = [0, 255, 0, 255]
  this.walkingspeed = size / 16
  this.t = 0
  this.hittingspeed = 40
  this.lasthit = -this.hittingspeed
  this.minuslives = 1
  this.hitted = false

  this.cash = 20
  this.instantcash = 5
  this.maxlives = 3
  this.lives = 3

  this.hit = function(minuslives) {
    this.lives -= minuslives
    this.hitted = 2
  }

  this.within = function(x, y, r) {
    if (dist(this.x, this.y, x, y) <= (this.width + this.height) / 2) {
      if (typeof(r) === "undefined") {
        if (dist(this.x, this.y, x, y) <= this.r) {
          return true
        }
      } else {
        if (dist(this.x, this.y, x, y) <= this.r + r) {
          return true
        }
      }
      var circles = 5
      var circledist = (this.width - this.height) / (circles - 1)
      var vec1 = turnVector(createVector(100, 0), map(this.rotation, 0, TWO_PI, 360, 0))
      vec1.setMag((this.width / 2) - (this.height / 2))
      var position = createVector(this.x, this.y)
      var acpoint = p5.Vector.add(position, vec1)
      var movevec = vec1
      movevec.mult(-1)
      movevec.setMag(circledist)
      for (wi = 0; wi < circles; wi++) {
        if (typeof(r) === "undefined") {
          if (dist(acpoint.x, acpoint.y, x, y) <= this.height / 2) {
            return true
          }
        } else {
          if (dist(acpoint.x, acpoint.y, x, y) <= (this.height / 2) + r) {
            return true
          }
        }
        acpoint.add(movevec)
      }
      return false
    }
  }

  this.update = function(player) {
    if (this.t % 2 === 0) {
      if (player.chamber === this.chamber) {
        this.pointingAt = [player.x, player.y]
        var vec1 = createVector(player.x - this.x, player.y - this.y)
        this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
        this.rotation += random(-PI / 10, PI / 10)
        var vec1 = createVector(this.walkingspeed, 0)
        vec1 = turnVector(vec1, map(-this.rotation + PI/2, 0, TWO_PI, 0, 360))
        this.x += vec1.x
        this.y += vec1.y
      } else {
        if (random(1) < 0.05) {
          this.rotation = random(0, TWO_PI)
        }
        var vec1 = createVector(this.walkingspeed, 0)
        vec1 = turnVector(vec1, map(-this.rotation + PI/2, 0, TWO_PI, 0, 360))
        this.x += vec1.x
        this.y += vec1.y
        if (this.x < this.chamber.x || this.y < this.chamber.y || this.x > this.chamber.x + this.chamber.width || this.y > this.chamber.y + this.chamber.height) {
          this.rotation += PI
          this.rotation = this.rotation % TWO_PI
        }
      }
      if (this.x < this.chamber.x) {
        this.x = this.chamber.x
      } else if (this.x > this.chamber.x + this.chamber.width) {
        this.x = this.chamber.x + this.chamber.width
      }
      if (this.y < this.chamber.y) {
        this.y = this.chamber.y
      } else if (this.y > this.chamber.y + this.chamber.height) {
        this.y = this.chamber.y + this.chamber.height
      }
      if ((this.t - this.lasthit) > this.hittingspeed && dist(this.x, this.y, player.x, player.y) < this.r + player.r) {
        player.hit(this.minuslives)
        this.lasthit = this.t
      }
      if (this.lives <= 0) {
        player.cash += this.cash
        for (ui = 0; ui < this.chamber.monsters.length; ui++) {
          if (this.chamber.monsters[ui] === this) {
            this.chamber.monsters.splice(ui, 1)
          }
        }
      }
    }
    this.t++
  }

  this.disp = function(x, y, w) {
    translate(x + (this.x * w), y + (this.y * w))
    rotate(this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
    if (this.hitted && this.hitted > 0) {
      fill(255, 0, 0)
      this.hitted--
    } else {
      fill(this.col)
      this.hitted = false
    }
    noStroke()
    rect(x + ((this.x - this.width/2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 4) * w)
    stroke(0)
    strokeWeight(1)
    ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
    translate(x + (this.x * w), y + (this.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
  }
}

function Ripper(x, y, size, chamber) {
  this.index = "ripper"
  this.chamber = chamber
  this.x = x
  this.y = y
  this.speedX = 0
  this.speedY = 0
  this.width = size * 2
  this.height = size
  this.r = size * 0.6
  this.rotation = 0
  this.pointingAt = []
  this.col = [150, 150, 150, 255]
  this.walkingspeed = size / 8
  this.gun = new GunR1(this)
  this.gun.resize(this.chamber.pathweight)
  this.t = 0
  this.lastshot = -1000
  this.hitted = false

  this.cash = 60
  this.instantcash = 15
  this.maxlives = 5
  this.lives = 5

  this.hit = function(minuslives) {
    this.lives -= minuslives
    this.hitted = 2
  }

  this.within = function(x, y, r) {
    if (dist(this.x, this.y, x, y) <= (this.width + this.height) / 2) {
      if (typeof(r) === "undefined") {
        if (dist(this.x, this.y, x, y) <= this.r) {
          return true
        }
      } else {
        if (dist(this.x, this.y, x, y) <= this.r + r) {
          return true
        }
      }
      var circles = 5
      var circledist = (this.width - this.height) / (circles - 1)
      var vec1 = turnVector(createVector(100, 0), map(this.rotation, 0, TWO_PI, 360, 0))
      vec1.setMag((this.width / 2) - (this.height / 2))
      var position = createVector(this.x, this.y)
      var acpoint = p5.Vector.add(position, vec1)
      var movevec = vec1
      movevec.mult(-1)
      movevec.setMag(circledist)
      for (wi = 0; wi < circles; wi++) {
        if (typeof(r) === "undefined") {
          if (dist(acpoint.x, acpoint.y, x, y) <= this.height / 2) {
            return true
          }
        } else {
          if (dist(acpoint.x, acpoint.y, x, y) <= (this.height / 2) + r) {
            return true
          }
        }
        acpoint.add(movevec)
      }
      return false
    }
  }

  this.update = function(player) {
    if (this.t % 2 === 0) {
      if (player.chamber === this.chamber) {
        this.pointingAt = [player.x, player.y]
        var vec1 = createVector(player.x - this.x, player.y - this.y)
        this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
        if (this.speedX === 0 && this.speedY === 0) {
          if (random(1) < 0.005) {
            var vec1 = createVector(random(1), random(1))
            vec1.setMag(this.walkingspeed)
            this.speedX = vec1.x
            this.speedY = vec1.y
          }
        } else {
          this.x += this.speedX
          this.y += this.speedY
          if (random(1) < 0.0075) {
            this.speedX = 0
            this.speedY = 0
          }
        }
        if ((this.t - this.lastshot) > this.gun.shootingspeed) {
          this.gun.shoot()
          this.lastshot = this.t
        }
      } else {
        if (random(1) < 0.05) {
          this.rotation = random(0, TWO_PI)
        }
        var vec1 = createVector(this.walkingspeed, 0)
        vec1 = turnVector(vec1, map(-this.rotation + PI/2, 0, TWO_PI, 0, 360))
        this.x += vec1.x
        this.y += vec1.y
        if (this.x < this.chamber.x || this.y < this.chamber.y || this.x > this.chamber.x + this.chamber.width || this.y > this.chamber.y + this.chamber.height) {
          this.rotation += PI
          this.rotation = this.rotation % TWO_PI
        }
      }
      if (this.x < this.chamber.x) {
        this.x = this.chamber.x
        this.speedX *= -1
      } else if (this.x > this.chamber.x + this.chamber.width) {
        this.x = this.chamber.x + this.chamber.width
        this.speedX *= -1
      }
      if (this.y < this.chamber.y) {
        this.y = this.chamber.y
        this.speedY *= -1
      } else if (this.y > this.chamber.y + this.chamber.height) {
        this.y = this.chamber.y + this.chamber.height
        this.speedY *= -1
      }
      if (this.lives <= 0) {
        player.cash += this.cash
        for (ui = 0; ui < this.chamber.monsters.length; ui++) {
          if (this.chamber.monsters[ui] === this) {
            this.chamber.monsters.splice(ui, 1)
          }
        }
      }
    }
    this.gun.update(player)
    this.t++
  }

  this.disp = function(x, y, w) {
    this.gun.disp(x, y, w)
    translate(x + (this.x * w), y + (this.y * w))
    rotate(this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
    if (this.hitted && this.hitted > 0) {
      fill(255, 0, 0)
      this.hitted--
    } else {
      fill(this.col)
      this.hitted = false
    }
    noStroke()
    rect(x + ((this.x - this.width/2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 4) * w)
    stroke(0)
    strokeWeight(1)
    ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
    translate(x + (this.x * w), y + (this.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
  }
}
