function Chamber(i, cx, cy, cw, ch, cp) {
  this.i = i
  this.x = cx
  this.y = cy
  this.width = cw
  this.height = ch
  this.m = [cx + (cw/2), cy + (ch/2)]
  this.neighbors = []
  this.paths = []
  this.connections = []
  this.hilightconnection = false
  this.pathweight = cp
  this.col = [200, 200, 200, 255]
  this.wallcol = [150, 150, 150, 255]
  this.connections = []
  this.item = undefined
  this.monsters = []
  this.visited = false

  this.addKey = function() {
    var newkey = new Key(this.m[0], this.m[1], this.pathweight * 0.75)
    this.item = newkey
  }

  this.addAid = function() {
    var newaid = new Aid(this.m[0], this.m[1], this.pathweight * 2)
    this.item = newaid
  }

  this.addAmmo = function() {
    var newammo = new Ammo(this.m[0], this.m[1], this.pathweight * 2)
    this.item = newammo
  }

  this.addCash = function() {
    var newcash = new Cash(this.m[0], this.m[1], this.pathweight * 2)
    this.item = newcash
  }

  this.addZombie = function(number) {
    for (zi = 0; zi < number; zi++) {
      var zX = random(this.x, this.x + this.width)
      var zY = random(this.y, this.y + this.height)
      var newzombie = new Zombie(zX, zY, this.pathweight, this)
      this.monsters.push(newzombie)
    }
  }

  this.addRipper = function(number) {
    for (ri = 0; ri < number; ri++) {
      var rX = random(this.x, this.x + this.width)
      var rY = random(this.y, this.y + this.height)
      var newripper = new Ripper(rX, rY, this.pathweight, this)
      this.monsters.push(newripper)
    }
  }

  this.intersect = function(x, y, w, h, r, checkx, checky) {
    if (checkx) {
      if (x + w + r >= this.x && x - r <= this.x + this.width) {
        return true
      } else {
        return false
      }
    } else if (checky) {
      if (y + h + r >= this.y && y - r <= this.y + this.height) {
        return true
      } else {
        return false
      }
    } else if (x + w + r >= this.x && x - r <= this.x + this.width &&
        y + h + r >= this.y && y - r <= this.y + this.height) {
      return true
    } else {
      return false
    }
  }

  this.checkNeighbors = function(returnunvisitedlength) {
    var unvisiteds = []
    for (ci = 0; ci < this.neighbors.length; ci++) {
      if (!this.neighbors[ci][1].visited) {
        unvisiteds.push(ci)
      }
    }
    if (returnunvisitedlength) {
      return unvisiteds.length
    } else {
      var pathindex = unvisiteds[floor(random(unvisiteds.length))]
      return [this.neighbors[pathindex][1], this.neighbors[pathindex][0]]
    }
  }

  this.within = function(x, y) {
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      return true
    } else {
      return false
    }
  }

  this.visible = function(x, y, w) {
    if (x + (this.x * w) >= -(this.width * w) && y + (this.y * w) >= -(this.height * w) && x + (this.x * w) <= width && y + (this.y * w) <= height) {
      return true
    } else {
      return false
    }
  }

  this.update = function(player) {
    for (di = 0; di < this.monsters.length; di++) {
      this.monsters[di].update(player)
    }
  }

  this.disp = function(x, y, w) {
    //fill(0, 0, 255, 150)
    //noStroke()
    //rect(x + (this.farestnegativeX * w), y + (this.farestnegativeY * w), (this.farestpositiveX - this.farestnegativeX) * w, (this.farestpositiveY - this.farestnegativeY) * w)
    fill(this.col)
    stroke(this.wallcol)
    strokeWeight(2)
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    if (this.item) {
      this.item.disp(x, y, w)
    }
    for (di = 0; di < this.monsters.length; di++) {
      this.monsters[di].disp(x, y, w)
    }
  }
}

function Key(x, y, r) {
  this.index = "key"
  this.x = x
  this.y = y
  this.r = r
  this.col = [255, 255, 0, 255]

  this.within = function(x, y, r) {
    if (dist(this.x, this.y, x, y) <= this.r + r) {
      return true
    } else {
      return false
    }
  }

  this.action = function(player) {
    player.keys++
  }

  this.disp = function(x, y, w) {
    keyX = x + (this.x * w)
    keyY = y + (this.y * w)
    keyR = this.r * w
    displayKey(keyX, keyY, keyR, this.col)
  }
}

function displayKey(x, y, r, col) {
  fill(col[0], col[1], col[2], 100)
  noStroke()
  ellipse(x, y, r * 2.25, r * 2.25)
  noFill()
  stroke(col)
  strokeWeight(r / 5)
  ellipse(x, y - (r / 2), r * (3 / 4), r * (3 / 4))
  fill(col)
  noStroke()
  rect(x - (r / 8), y, r / 4, r)
  rect(x - (r / 4), y + (r / 4), r / 2, r / 4)
  rect(x - (r / 4), y + (r  * (3 / 4)), r / 2, r / 4)
}

function Aid(x, y, w) {
  this.index = "aid"
  this.x = x - (w / 2)
  this.y = y - (w * (3 / 10))
  this.width = w
  this.height = w * (3 / 5)
  this.col = [255, 51, 51, 255]
  this.symbolcol = [255, 255, 255, 255]

  this.within = function(x, y, r) {
    if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
      return true
    } else {
      return false
    }
  }

  this.action = function(player) {
    player.lives = player.maxlives
  }

  this.disp = function(x, y, w) {
    fill(this.col)
    stroke(this.symbolcol)
    strokeWeight((this.width / 50) * w)
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    fill(this.symbolcol)
    noStroke()
    rect(x + ((this.x + (this.width / 2) - (this.width / 16)) * w), y + ((this.y + (this.height / 2) - (this.height * (1 / 3))) * w), (this.width / 8) * w, this.height * (2 / 3) * w)
    rect(x + ((this.x + (this.width / 2) - (this.height *  (1 / 3))) * w), y + ((this.y + (this.height / 2) - (this.width / 16)) * w), this.height * (2 / 3) * w, (this.width / 8) * w)
  }
}

function Ammo(x, y, w) {
  this.index = "ammo"
  this.x = x - (w / 2)
  this.y = y - (w * (3 / 10))
  this.width = w
  this.height = w * (3 / 5)
  this.col = [238, 201, 0, 255]
  this.symbolcol = [40, 40, 40, 255]

  this.within = function(x, y, r) {
    if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
      return true
    } else {
      return false
    }
  }

  this.action = function(player) {
    player.ammo = player.maxammo
  }

  this.disp = function(x, y, w) {
    fill(this.col)
    stroke(this.symbolcol)
    strokeWeight((this.width / 50) * w)
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    fill(this.symbolcol)
    noStroke()
    rect(x + ((this.x + (this.width / 2) - (this.width / 16)) * w), y + ((this.y + (this.height / 2) - (this.height * (1 / 3))) * w), (this.width / 8) * w, this.height * (2 / 3) * w)
    rect(x + ((this.x + (this.width / 2) - (this.height *  (1 / 3))) * w), y + ((this.y + (this.height / 2) - (this.width / 16)) * w), this.height * (2 / 3) * w, (this.width / 8) * w)
  }
}

function Cash(x, y, w) {
  this.index = "cash"
  this.x = x - (w / 2)
  this.y = y - (w * (3 / 10))
  this.width = w
  this.height = w * (3 / 5)
  this.col = [0, 200, 0, 255]
  this.symbolcol = [40, 255, 40, 255]
  this.cash = round(random(100, 500))

  this.within = function(x, y, r) {
    if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
      return true
    } else {
      return false
    }
  }

  this.action = function(player) {
    player.cash += this.cash
  }

  this.disp = function(x, y, w) {
    fill(this.col)
    stroke(this.symbolcol)
    strokeWeight((this.width / 50) * w)
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    fill(this.symbolcol)
    stroke(255)
    strokeWeight(1)
    textAlign(CENTER, CENTER)
    textSize(this.height * 0.5 * w)
    text(this.cash + "$", x + ((this.x + (this.width / 2)) * w), y + ((this.y + (this.height / 2)) * w))
  }
}
