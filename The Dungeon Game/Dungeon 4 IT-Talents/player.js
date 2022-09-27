function Player() {
  this.chamber = 0
  this.x = 0
  this.y = 0
  this.width = 0.01
  this.height = 0.005
  this.r = 0.003
  this.rotation = 0
  this.pointingAt = [0, 0]
  this.col = [50, 50, 255, 255]
  this.walkingspeed = 0.003
  this.gun = new Gun1(this)
  this.guns = [this.gun]
  this.t = 0
  this.lastshot = -1000
  this.hitted = false

  this.cash = 0
  this.instantcash = 10
  this.keys = 0
  this.maxlives = 3
  this.lives = 3
  this.maxammo = 20
  this.ammo = 20

  this.resize = function(size) {
    this.width = size
    this.height = size / 2
    this.r = size / 3.333
    this.walkingspeed = size / 8
    this.gun.resize(size)
  }

  this.goToChamber = function(chamber, px, py) {
    this.chamber = chamber
    if (px && py) {
      this.x = px
      this.y = py
    } else {
      this.x = chamber.m[0]
      this.y = chamber.m[1]
    }
  }

  this.hit = function(minuslives) {
    this.lives -= minuslives
    this.hitted = 2
  }

  this.shoot = function() {
    if (this.ammo > 0 && (this.t - this.lastshot) > this.gun.shootingspeed) {
      this.gun.shoot()
      this.ammo--
      this.lastshot = this.t
    }
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

  this.update = function() {
    this.move()
    if (this.chamber.item) {
      if (this.chamber.item.within(this.x, this.y, this.width / 2)) {
        this.chamber.item.action(this)
        this.chamber.item = undefined
      }
    }
    this.gun.update()
    this.t++
  }

  this.move = function() {
    /*
    var vec1 = createVector(this.walkingspeed, 0)
    vec1 = turnVector(vec1, map(-this.rotation + PI/2, 0, TWO_PI, 0, 360))
    if (keyIsDown(87)) {
        this.x += vec1.x
        this.y += vec1.y
    }
    if (keyIsDown(83)) {
        this.x -= vec1.x
        this.y -= vec1.y
    }
    if (keyIsDown(65)) {
        this.x -= vec1.y
        this.y += vec1.x
    }
    if (keyIsDown(68)) {
        this.x += vec1.y
        this.y -= vec1.x
    }
    */
    if (keyIsDown(87)) {
        this.y -= this.walkingspeed
    }
    if (keyIsDown(83)) {
        this.y += this.walkingspeed
    }
    if (keyIsDown(65)) {
        this.x -= this.walkingspeed
    }
    if (keyIsDown(68)) {
        this.x += this.walkingspeed
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
  }

  this.disp = function(x, y, w, pointAtX, pointAtY) {
    this.gun.disp(x, y, w)
    this.pointingAt = [(pointAtX - x) / w, (pointAtY - y) / w]
    /*
    var hitx = this.x
    var hity = this.y
    var vec1 = createVector(this.pointingAt[0] - this.x, this.pointingAt[1] - this.y)
    var pointingDist = dist(this.x, this.y, this.pointingAt[0], this.pointingAt[1])
    vec1.setMag(this.walkingspeed)
    var XYdist = pointingDist / 2
    while (XYdist > 0 && XYdist < pointingDist) {
      hitx += vec1.x
      hity += vec1.y
      XYdist = dist(this.x, this.y, hitx, hity)
      for (hi1 = 0; hi1 < this.chamber.monsters.length; hi1++) {
        if (this.chamber.monsters[hi1].within(hitx, hity)) {
          stroke(0)
          line(x + (this.x * w), y + (this.y * w), x + (hitx * w), y + (hity * w))
          hi1 = this.chamber.monsters.length
          XYdist = -1
        }
      }
      if (hitx < this.chamber.x || hity < this.chamber.y || hitx > this.chamber.x + this.chamber.width || hity > this.chamber.y + this.chamber.height) {
        XYdist = 0
      }
    }
    stroke(40)
    if (XYdist > 0) {
      line(x + (this.x * w), y + (this.y * w), x + (this.pointingAt[0] * w), y + (this.pointingAt[1] * w))
    } else if (XYdist === 0) {
      line(x + (this.x * w), y + (this.y * w), x + (hitx * w), y + (hity * w))
    }
    */
    var vec1 = createVector(pointAtX - (x + (this.x * w)), pointAtY - (y + (this.y * w)))
    this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
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
