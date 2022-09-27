function Gun1(owner, pathweight) {
  this.name = "Gun P1"
  this.owner = owner
  this.cost = 0
  this.costs = 0
  this.shootingspeed = 40
  this.minuslives = 1
  this.col = [255, 0, 0, 255]
  this.strokecol = [51, 51, 51, 255]
  this.width = pathweight / 8
  this.height = pathweight * (1.5 / 3)
  this.size = pathweight / 6
  this.protectilespeed = (pathweight / 8) / 1.25
  this.protectiles = []

  this.resize = function(pathweight) {
    this.width = pathweight / 8
    this.height = pathweight * (1.5 / 3)
    this.size = pathweight / 6
    this.protectilespeed = (pathweight / 8) / 1.25
  }

  this.shoot = function() {
    this.owner.cash -= this.costs
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    vec1.setMag(this.protectilespeed)
    var newprotectile = new Protectile(this, this.owner.chamber, this.owner, this.x, this.y, vec1.x, vec1.y, this.owner.chamber.pathweight)
    this.protectiles.push(newprotectile)
  }

  this.action = function(enemy) {
    enemy.hit(this.minuslives)
    this.owner.cash += enemy.instantcash
  }

  this.update = function(enemy) {
    var vec1 = createVector(this.owner.width / 2, 0)
    vec1 = turnVector(vec1, map(this.owner.rotation, 0, TWO_PI, 360, 0))
    this.x = this.owner.x + vec1.x
    this.y = this.owner.y + vec1.y
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    this.rotation = vec1.heading() + PI/2
    for (gui = this.protectiles.length - 1; gui >= 0; gui--) {
      if (this.protectiles[gui].update(enemy)) {
        this.protectiles.splice(gui, 1)
      }
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    fill(this.col)
    stroke(this.strokecol)
    rect(x + ((this.owner.x + (this.owner.width / 2)) * w), y + (this.owner.y * w), this.width * w, -this.height * w)
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    for (gui = 0; gui < this.protectiles.length; gui++) {
      this.protectiles[gui].disp(x, y, w)
    }
  }

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Reload-Time:   " + this.shootingspeed, x + 10, y)
    y += textSize() + 5
    text("Shot-Speed:    " + round(this.protectilespeed * 10000), x + 10, y)
    y += textSize() + 5
    text("Damage:         " + this.minuslives, x + 10, y)
    y += textSize() + 5
    text("Cost p/Shot:    " + this.costs, x + 10, y)
  }

  this.buy = function(player) {
    var newgun = new Gun1(player)
    newgun.resize(player.chamber.pathweight)
    player.guns.push(newgun)
    player.gun = newgun
    player.cash -= this.cost
  }
}

function Gun2(owner, pathweight) {
  this.name = "Gun P2"
  this.owner = owner
  this.cost = 500
  this.costs = 0
  this.shootingspeed = 30
  this.minuslives = 1
  this.col = [0, 255, 0, 255]
  this.strokecol = [51, 51, 51, 255]
  this.width = pathweight / 8
  this.height = pathweight * (1.75 / 3)
  this.size = pathweight / 5
  this.protectilespeed = (pathweight / 8) * 1.25
  this.protectiles = []

  this.resize = function(pathweight) {
    this.width = pathweight / 8
    this.height = pathweight * (1.75 / 3)
    this.size = pathweight / 5
    this.protectilespeed = (pathweight / 8) * 1.25
  }

  this.shoot = function() {
    this.owner.cash -= this.costs
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    vec1.setMag(this.protectilespeed)
    var newprotectile = new Protectile(this, this.owner.chamber, this.owner, this.x, this.y, vec1.x, vec1.y, this.owner.chamber.pathweight)
    this.protectiles.push(newprotectile)
  }

  this.action = function(enemy) {
    enemy.hit(this.minuslives)
    this.owner.cash += enemy.instantcash
  }

  this.update = function(enemy) {
    var vec1 = createVector(this.owner.width / 2, 0)
    vec1 = turnVector(vec1, map(this.owner.rotation, 0, TWO_PI, 360, 0))
    this.x = this.owner.x + vec1.x
    this.y = this.owner.y + vec1.y
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    this.rotation = vec1.heading() + PI/2
    for (gui = this.protectiles.length - 1; gui >= 0; gui--) {
      if (this.protectiles[gui].update(enemy)) {
        this.protectiles.splice(gui, 1)
      }
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    fill(this.col)
    stroke(this.strokecol)
    rect(x + ((this.owner.x + (this.owner.width / 2)) * w), y + (this.owner.y * w), this.width * w, -this.height * w)
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    for (gui = 0; gui < this.protectiles.length; gui++) {
      this.protectiles[gui].disp(x, y, w)
    }
  }

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Reload-Time:   " + this.shootingspeed, x + 10, y)
    y += textSize() + 5
    text("Shot-Speed:    " + round(this.protectilespeed * 10000), x + 10, y)
    y += textSize() + 5
    text("Damage:         " + this.minuslives, x + 10, y)
    y += textSize() + 5
    text("Cost p/Shot:    " + this.costs, x + 10, y)
  }

  this.buy = function(player) {
    var newgun = new Gun2(player)
    newgun.resize(player.chamber.pathweight)
    player.guns.push(newgun)
    player.gun = newgun
    player.cash -= this.cost
  }
}

function Gun3(owner, pathweight) {
  this.name = "Gun P3"
  this.owner = owner
  this.cost = 750
  this.costs = 5
  this.shootingspeed = 10
  this.minuslives = 1
  this.col = [0, 0, 255, 255]
  this.strokecol = [51, 51, 51, 255]
  this.width = pathweight / 7
  this.height = pathweight * (1.75 / 3)
  this.size = pathweight / 4.5
  this.protectilespeed = (pathweight / 8) * 2
  this.protectiles = []

  this.resize = function(pathweight) {
    this.width = pathweight / 7
    this.height = pathweight * (1.75 / 3)
    this.size = pathweight / 4.5
    this.protectilespeed = (pathweight / 8) * 2
  }

  this.shoot = function() {
    this.owner.cash -= this.costs
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    vec1.setMag(this.protectilespeed)
    var newprotectile = new Protectile(this, this.owner.chamber, this.owner, this.x, this.y, vec1.x, vec1.y, this.owner.chamber.pathweight)
    this.protectiles.push(newprotectile)
  }

  this.action = function(enemy) {
    enemy.hit(this.minuslives)
    this.owner.cash += enemy.instantcash
  }

  this.update = function(enemy) {
    var vec1 = createVector(this.owner.width / 2, 0)
    vec1 = turnVector(vec1, map(this.owner.rotation, 0, TWO_PI, 360, 0))
    this.x = this.owner.x + vec1.x
    this.y = this.owner.y + vec1.y
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    this.rotation = vec1.heading() + PI/2
    for (gui = this.protectiles.length - 1; gui >= 0; gui--) {
      if (this.protectiles[gui].update(enemy)) {
        this.protectiles.splice(gui, 1)
      }
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    fill(this.col)
    stroke(this.strokecol)
    rect(x + ((this.owner.x + (this.owner.width / 2)) * w), y + (this.owner.y * w), this.width * w, -this.height * w)
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    for (gui = 0; gui < this.protectiles.length; gui++) {
      this.protectiles[gui].disp(x, y, w)
    }
  }

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Reload-Time:   " + this.shootingspeed, x + 10, y)
    y += textSize() + 5
    text("Shot-Speed:    " + round(this.protectilespeed * 10000), x + 10, y)
    y += textSize() + 5
    text("Damage:         " + this.minuslives, x + 10, y)
    y += textSize() + 5
    text("Cost p/Shot:    " + this.costs, x + 10, y)
  }

  this.buy = function(player) {
    var newgun = new Gun3(player)
    newgun.resize(player.chamber.pathweight)
    player.guns.push(newgun)
    player.gun = newgun
    player.cash -= this.cost
  }
}

function Gun4(owner, pathweight) {
  this.name = "Gun P4"
  this.owner = owner
  this.cost = 850
  this.costs = 10
  this.shootingspeed = 35
  this.minuslives = 2
  this.col = [0, 255, 255, 255]
  this.strokecol = [51, 51, 51, 255]
  this.width = pathweight / 7
  this.height = pathweight * (1.5 / 3)
  this.size = pathweight / 4.5
  this.protectilespeed = (pathweight / 8) * 1.5
  this.protectiles = []

  this.resize = function(pathweight) {
    this.width = pathweight / 7
    this.height = pathweight * (1.5 / 3)
    this.size = pathweight / 4.5
    this.protectilespeed = (pathweight / 8) * 1.5
  }

  this.shoot = function() {
    this.owner.cash -= this.costs
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    vec1.setMag(this.protectilespeed)
    var newprotectile = new Protectile(this, this.owner.chamber, this.owner, this.x, this.y, vec1.x, vec1.y, this.owner.chamber.pathweight)
    this.protectiles.push(newprotectile)
  }

  this.action = function(enemy) {
    enemy.hit(this.minuslives)
    this.owner.cash += enemy.instantcash
  }

  this.update = function(enemy) {
    var vec1 = createVector(this.owner.width / 2, 0)
    vec1 = turnVector(vec1, map(this.owner.rotation, 0, TWO_PI, 360, 0))
    this.x = this.owner.x + vec1.x
    this.y = this.owner.y + vec1.y
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    this.rotation = vec1.heading() + PI/2
    for (gui = this.protectiles.length - 1; gui >= 0; gui--) {
      if (this.protectiles[gui].update(enemy)) {
        this.protectiles.splice(gui, 1)
      }
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    fill(this.col)
    stroke(this.strokecol)
    rect(x + ((this.owner.x + (this.owner.width / 2)) * w), y + (this.owner.y * w), this.width * w, -this.height * w)
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    for (gui = 0; gui < this.protectiles.length; gui++) {
      this.protectiles[gui].disp(x, y, w)
    }
  }

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Reload-Time:   " + this.shootingspeed, x + 10, y)
    y += textSize() + 5
    text("Shot-Speed:    " + round(this.protectilespeed * 10000), x + 10, y)
    y += textSize() + 5
    text("Damage:         " + this.minuslives, x + 10, y)
    y += textSize() + 5
    text("Cost p/Shot:    " + this.costs, x + 10, y)
  }

  this.buy = function(player) {
    var newgun = new Gun4(player)
    newgun.resize(player.chamber.pathweight)
    player.guns.push(newgun)
    player.gun = newgun
    player.cash -= this.cost
  }
}

function Gun5(owner, pathweight) {
  this.name = "Gun P5"
  this.owner = owner
  this.cost = 1050
  this.costs = 5
  this.shootingspeed = 20
  this.minuslives = 1
  this.col = [255, 255, 0, 255]
  this.strokecol = [51, 51, 51, 255]
  this.width = pathweight / 9
  this.height = pathweight * (1.85 / 3)
  this.size = pathweight / 4.5
  this.protectilespeed = (pathweight / 8) * 3
  this.protectiles = []

  this.resize = function(pathweight) {
    this.width = pathweight / 7
    this.height = pathweight * (1.85 / 3)
    this.size = pathweight / 4.5
    this.protectilespeed = (pathweight / 8) * 2
  }

  this.shoot = function() {
    this.owner.cash -= this.costs
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    vec1.setMag(this.protectilespeed)
    var newprotectile = new Protectile(this, this.owner.chamber, this.owner, this.x, this.y, vec1.x, vec1.y, this.owner.chamber.pathweight)
    this.protectiles.push(newprotectile)
  }

  this.action = function(enemy) {
    enemy.hit(this.minuslives)
    this.owner.cash += enemy.instantcash
  }

  this.update = function(enemy) {
    var vec1 = createVector(this.owner.width / 2, 0)
    vec1 = turnVector(vec1, map(this.owner.rotation, 0, TWO_PI, 360, 0))
    this.x = this.owner.x + vec1.x
    this.y = this.owner.y + vec1.y
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    this.rotation = vec1.heading() + PI/2
    for (gui = this.protectiles.length - 1; gui >= 0; gui--) {
      if (this.protectiles[gui].update(enemy)) {
        this.protectiles.splice(gui, 1)
      }
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    fill(this.col)
    stroke(this.strokecol)
    rect(x + ((this.owner.x + (this.owner.width / 2)) * w), y + (this.owner.y * w), this.width * w, -this.height * w)
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    for (gui = 0; gui < this.protectiles.length; gui++) {
      this.protectiles[gui].disp(x, y, w)
    }
  }

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Reload-Time:   " + this.shootingspeed, x + 10, y)
    y += textSize() + 5
    text("Shot-Speed:    " + round(this.protectilespeed * 10000), x + 10, y)
    y += textSize() + 5
    text("Damage:         " + this.minuslives, x + 10, y)
    y += textSize() + 5
    text("Cost p/Shot:    " + this.costs, x + 10, y)
  }

  this.buy = function(player) {
    var newgun = new Gun5(player)
    newgun.resize(player.chamber.pathweight)
    player.guns.push(newgun)
    player.gun = newgun
    player.cash -= this.cost
  }
}

function GunR1(owner, pathweight) {
  this.name = "Gun R1"
  this.owner = owner
  this.cost = 0
  this.costs = 0
  this.shootingspeed = 60
  this.minuslives = 1
  this.col = [255, 0, 0, 255]
  this.strokecol = [51, 51, 51, 255]
  this.width = pathweight / 4
  this.height = pathweight
  this.size = pathweight / 6
  this.protectilespeed = pathweight / 8
  this.protectiles = []

  this.resize = function(pathweight) {
    this.width = pathweight / 4
    this.height = pathweight
    this.size = pathweight / 6
    this.protectilespeed = pathweight / 8
  }

  this.shoot = function() {
    this.owner.cash -= this.costs
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    vec1.setMag(this.protectilespeed)
    var newprotectile = new Protectile(this, this.owner.chamber, this.owner, this.x, this.y, vec1.x, vec1.y, this.owner.chamber.pathweight)
    this.protectiles.push(newprotectile)
  }

  this.action = function(enemy) {
    enemy.hit(this.minuslives)
    this.owner.cash += enemy.instantcash
  }

  this.update = function(enemy) {
    var vec1 = createVector(this.owner.width / 2, 0)
    vec1 = turnVector(vec1, map(this.owner.rotation, 0, TWO_PI, 360, 0))
    this.x = this.owner.x + vec1.x
    this.y = this.owner.y + vec1.y
    var vec1 = createVector(this.owner.pointingAt[0] - this.x, this.owner.pointingAt[1] - this.y)
    this.rotation = vec1.heading() + PI/2
    for (gui = this.protectiles.length - 1; gui >= 0; gui--) {
      if (this.protectiles[gui].update(enemy)) {
        this.protectiles.splice(gui, 1)
      }
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    fill(this.col)
    stroke(this.strokecol)
    rect(x + ((this.owner.x + (this.owner.width / 2)) * w), y + (this.owner.y * w), this.width * w, -this.height * w)
    translate(x + (this.owner.x * w), y + (this.owner.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.owner.x * w)), -(y + (this.owner.y * w)))
    for (gui = 0; gui < this.protectiles.length; gui++) {
      this.protectiles[gui].disp(x, y, w)
    }
  }

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Reload-Time:   " + this.shootingspeed, x + 10, y)
    y += textSize() + 5
    text("Shot-Speed:    " + round(this.protectilespeed * 10000), x + 10, y)
    y += textSize() + 5
    text("Damage:         " + this.minuslives, x + 10, y)
    y += textSize() + 5
    text("Cost p/Shot:    " + this.costs, x + 10, y)
  }

  this.buy = function(player) {
    var newgun = new GunR1(player)
    newgun.resize(player.chamber.pathweight)
    player.guns.push(newgun)
    player.gun = newgun
    player.cash -= this.cost
  }
}

function Protectile(gun, chamber, owner, x, y, speedX, speedY, pathweight) {
  this.gun = gun
  this.chamber = chamber
  this.owner = owner
  this.x = x
  this.y = y
  this.width = this.gun.size
  this.height = this.gun.size * (6 / 8)
  this.speedX = speedX
  this.speedY = speedY
  var vec1 = createVector(speedX, speedY)
  this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI)
  this.col = [0, 0, 0, 255]

  this.update = function(enemy) {
    this.x += this.speedX
    this.y += this.speedY
    for (pui = 0; pui < this.chamber.monsters.length; pui++) {
      if (this.owner.index) {
        if (enemy.within(this.x, this.y)) {
          this.gun.action(enemy)
          return true
        }
      } else {
        if (this.chamber.monsters[pui].within(this.x, this.y)) {
          this.gun.action(this.chamber.monsters[pui])
          return true
        }
      }
    }
    if (this.x < this.chamber.x || this.y < this.chamber.y || this.x > this.chamber.x + this.chamber.width || this.y > this.chamber.y + this.chamber.height) {
      return true
    }
  }

  this.disp = function(x, y, w) {
    translate(x + (this.x * w), y + (this.y * w))
    rotate(this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
    fill(this.col)
    noStroke()
    rect(x + ((this.x - (this.width / 2)) * w), y + ((this.y - (this.height / 2)) * w), this.width * w, this.height * w, (this.height / 4) * w)
    translate(x + (this.x * w), y + (this.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
  }
}
