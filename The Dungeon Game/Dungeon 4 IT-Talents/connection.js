function Connection(chambera, chamberb, direction, pathweight) {
  this.chamberA = chambera
  this.chamberA.connections.push([this, chamberb])
  this.chamberB = chamberb
  this.chamberB.connections.push([this, chambera])
  this.pathweight = pathweight
  this.enterPointA = []
  this.enterPointB = []
  if (direction === 0 || direction == 1) {
    if (direction === 0) {
      this.x = this.chamberA.x + this.chamberA.width
      this.width = this.chamberB.x - (this.chamberA.x + this.chamberA.width)
      this.enterPointA[0] = this.x - (this.pathweight * 0.75)
      this.enterPointB[0] = this.x + this.width + (this.pathweight * 0.75)
    } else {
      this.x = this.chamberA.x
      this.width = (this.chamberB.x + this.chamberB.width) - this.chamberA.x
      this.enterPointA[0] = this.x + (this.pathweight * 0.75)
      this.enterPointB[0] = this.x + this.width - (this.pathweight * 0.75)
    }
    if (this.chamberA.y >= this.chamberB.y) {
      var minY = this.chamberA.y
    } else {
      var minY = this.chamberB.y
    }
    if ((this.chamberA.y + this.chamberA.height) <= (this.chamberB.y + this.chamberB.height)) {
      var maxY = (this.chamberA.y + this.chamberA.height) - this.pathweight
    } else {
      var maxY = (this.chamberB.y + this.chamberB.height) - this.pathweight
    }
    this.y = random(minY, maxY)
    this.height = this.pathweight
    this.accesPointA = [this.x, this.y + (this.pathweight / 2)]
    this.accesPointB = [this.x + this.width, this.y + (this.pathweight / 2)]
    this.enterPointA[1] = this.y + (this.pathweight / 2)
    this.enterPointB[1] = this.y + (this.pathweight / 2)
  } else {
    if (direction == 2) {
      this.y = this.chamberA.y + this.chamberA.height
      this.height = this.chamberB.y - (this.chamberA.y + this.chamberA.height)
      this.enterPointA[1] = this.y - (this.pathweight * 0.75)
      this.enterPointB[1] = this.y + this.height + (this.pathweight * 0.75)
    } else {
      this.y = this.chamberA.y
      this.height = (this.chamberB.y + this.chamberB.height) - this.chamberA.y
      this.enterPointA[1] = this.y + (this.pathweight * 0.75)
      this.enterPointB[1] = this.y + this.height - (this.pathweight * 0.75)
    }
    if (this.chamberA.x >= this.chamberB.x) {
      var minX = this.chamberA.x
    } else {
      var minX = this.chamberB.x
    }
    if ((this.chamberA.x + this.chamberA.width) <= (this.chamberB.x + this.chamberB.width)) {
      var maxX = (this.chamberA.x + this.chamberA.width) - this.pathweight
    } else {
      var maxX = (this.chamberB.x + this.chamberB.width) - this.pathweight
    }
    this.x = random(minX, maxX)
    this.width = this.pathweight
    this.accesPointA = [this.x + (this.pathweight / 2), this.y]
    this.accesPointB = [this.x + (this.pathweight / 2), this.y + this.height]
    this.enterPointA[0] = this.x + (this.pathweight / 2)
    this.enterPointB[0] = this.x + (this.pathweight / 2)
  }
  this.col = [132, 31, 39, 255]
  this.lockedcol = [255, 255, 0, 255]
  this.locked = false

  this.visible = function() {
    if (x + (this.x * w) >= -(this.width * w) && y + (this.y * w) >= -(this.height * w) && x + (this.x * w) <= width && y + (this.y * w) <= height) {
      return true
    } else {
      return false
    }
  }

  this.check = function(player) {
    if (player.chamber === this.chamberA) {
      if (dist(player.x, player.y, this.accesPointA[0], this.accesPointA[1]) <= this.pathweight / 2) {
        if (!this.locked || player.keys > 0) {
          player.goToChamber(this.chamberB, this.enterPointB[0], this.enterPointB[1])
          if (this.locked) {
            player.keys--
            this.locked = false
          }
          var duration = floor(dist(this.chamberA.m[0], this.chamberA.m[1], this.chamberB.m[0], this.chamberB.m[1]) / (player.walkingspeed * 6))
          var vecX = (this.chamberB.m[0] - this.chamberA.m[0]) / duration
          var vecY = (this.chamberB.m[1] - this.chamberA.m[1]) / duration
          return [duration, vecX, vecY]
        }
      }
    } else if (player.chamber === this.chamberB) {
      if (dist(player.x, player.y, this.accesPointB[0], this.accesPointB[1]) <= this.pathweight / 2) {
        if (!this.locked || player.keys > 0) {
          player.goToChamber(this.chamberA, this.enterPointA[0], this.enterPointA[1])
          if (this.locked) {
            player.keys--
            this.locked = false
          }
          var duration = floor(dist(this.chamberB.m[0], this.chamberB.m[1], this.chamberA.m[0], this.chamberA.m[1]) / (player.walkingspeed * 6))
          var vecX = (this.chamberA.m[0] - this.chamberB.m[0]) / duration
          var vecY = (this.chamberA.m[1] - this.chamberB.m[1]) / duration
          return [duration, vecX, vecY]
        }
      }
    }
    return undefined
  }

  this.disp = function(x, y, w) {
    if (this.locked) {
      fill(this.lockedcol)
    } else {
      fill(this.col)
    }
    noStroke()
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    fill(255)
    //ellipse(x + (this.enterPointA[0] * w), y + (this.enterPointA[1] * w), this.pathweight * 2 * w, this.pathweight * 2 * w)
    //ellipse(x + (this.enterPointB[0] * w), y + (this.enterPointB[1] * w), this.pathweight * 2 * w, this.pathweight * 2 * w)
  }
}
