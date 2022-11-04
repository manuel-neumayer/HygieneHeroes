//Das chamber.js Skript enthält die Chamber() constructerfunction, die eine Kammer im Dungeon mit allen Monstern und Items
//darstellt und sie visualisiert und updated. Darunter finden sich die verschiedenen Items der Map. (Siehe Dungeon.update() und Dungeon.disp()).
function Chamber(i, cx, cy, cw, ch, cp, orientation) {
  this.orientation = orientation
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
  this.col = [255, 248, 220, 255]
  this.wallcol = [132, 31, 39, 255]
  this.connections = []
  this.item = undefined
  this.furniture = []
  this.monsters = []
  this.horizontal_desk_fitting_x = []
  this.horizontal_desk_fitting_y = []
  this.vertical_desk_fitting_x = []
  this.vertical_desk_fitting_y = []
  
    this.visited = false

    var w = this.pathweight * 2

    //horizontal desk coordinates
    this.lh = 0
    this.lv = 0
    var shift = 0;
    for (var ii = 0; ii < Math.floor(this.height / (1.5*w)) - w; ii++) {
        for (var i = 0; i < Math.floor(this.width / (2 * w)) - 2 * w; i++) {
            this.horizontal_desk_fitting_x.push(this.x + .75*w + i * 2 * w)
            this.horizontal_desk_fitting_y.push(this.y + .75*w + shift)
        }
        shift = shift + w
    }
    
    //vertical desk coordinates
    shift = 0;
    for (var ii = 0; ii < Math.floor(this.height / (2 * w)); ii++) {
        for (var i = 0; i < Math.floor(this.width / (1.5 * w)) - w; i++) {
            //console.log(this.width / (w))
            this.vertical_desk_fitting_x.push(this.x + .75 *w + i * w)
            this.vertical_desk_fitting_y.push(this.y + .75 *w + 2*shift)
        }
        shift = shift + w
    }

    if (this.horizontal_desk_fitting_x.length > this.horizontal_desk_fitting_y.length) {
        this.lh = this.horizontal_desk_fitting_y.length
    } else { this.lh = this.horizontal_desk_fitting_x.length }
    if (this.vertical_desk_fitting_x.length > this.vertical_desk_fitting_y.length) {
        this.lv = this.vertical_desk_fitting_y.length
    } else { this.lv = this.vertical_desk_fitting_x.length }

  //Die .add functions der Chamber() bereichern sie mit verschiedenen Monstern oder einem Item (Siehe Dungeon.setup()).
  this.addKey = function() {
    var newkey = new Key(this.m[0], this.m[1], this.pathweight * 0.75)
    //Siehe Key()
    this.item = newkey
  }

  this.addAid = function() {
    var newaid = new Aid(this.m[0], this.m[1], this.pathweight * 2)
    //Siehe Aid()
    this.item = newaid
  }

  this.addAmmo = function() {
    var newammo = new Ammo(this.m[0], this.m[1], this.pathweight * 2)
    //Siehe Ammo()
    this.item = newammo
  }

  this.addCash = function() {
    var newcash = new Cash(this.m[0], this.m[1], this.pathweight * 2)
    //Siehe Cash()
    this.item = newcash
  }

    this.addZombie = function (number) {
     // console.log("asajfkadfhsd")
    //Mit der Variable number können mehrere Monster zugleich initialisiert werden (Siehe Dungeon.setup()).
    for (zi = 0; zi < number; zi++) {
      var zX = random(this.x, this.x + this.width)
      var zY = random(this.y, this.y + this.height)
      var newzombie = new Zombie(zX, zY, this.pathweight, this)
      //Siehe Zombie()
      this.monsters.push(newzombie)
    }
    }

    //new function added by Matthew 9/29
    this.addBottle = function (number) {
        var newBottle = new Bottle(this.m[0], this.m[1], this.pathweight, this, number)
        this.item = newBottle
    }

    this.addBottle = function (number) {
      var newBottle = new Bottle(this.m[0], this.m[1], this.pathweight, this)
      this.item = newBottle
      this.addZombie(floor(random(4)))
    }

  this.addSink = function() {
    w = this.pathweight * 2
    r = random(1)
    if (r < 0.5) {
      p = [this.x + w/2, this.m[1]]
    } else {
      p = [this.m[0], this.y + w/2]
    }
      this.item = new Sink(p[0], p[1], w)
   }

    this.addDesk = function () {
        w = this.pathweight * 2

        if (random(1) < 0.5) {
            p = [this.x + w / 2, this.m[1]]
            o = "horizontal"
        } else {
            p = [this.m[0], this.y + w / 2]
            o = "vertical"
        }
        this.item = new Desk(p[0], p[1], w, o)
    }
    
    this.addDeskArray = function (number) {
        w = this.pathweight * 2
        if (number > .5) {
            o = "horizontal"
            for (i = 0; i < this.lh; i++) {
                x = this.horizontal_desk_fitting_x[i]
                y = this.horizontal_desk_fitting_y[i]
                var newdesk = new Desk(x, y, w, o)
                this.furniture.push(newdesk)
            }
        } else {
            o = "vertical"
            for (i = 0; i < this.lv; i++) {
                x = this.vertical_desk_fitting_x[i]
                y = this.vertical_desk_fitting_y[i]
                var newdesk = new Desk(x, y, w, o)
                this.furniture.push(newdesk)
            }
        }
    }

  this.addRipper = function(gun) {
    //Mit der Variable gun kann die Waffe des Rippers festgelegt werden.
    var rX = random(this.x, this.x + this.width)
    var rY = random(this.y, this.y + this.height)
    var newripper = new Ripper(rX, rY, this.pathweight, this, gun)
    //Siehe Ripper()
    this.monsters.push(newripper)
  }

  this.addHuman = function(number) {
    for (zi = 0; zi < number; zi++) {
      var zX = random(this.x, this.x + this.width)
      var zY = random(this.y, this.y + this.height)
      var zT = Math.floor(random() * 2)
      var newhuman = new Human(zX, zY, this.pathweight, this, null, zT)
      this.monsters.push(newhuman)
    }
  }

  //Die .intersect() function überprüft ob sich ein Rechteck mit Koordinaten x, y und Breite/Höhe w, h
  //innerhalb eines bestimmten Radius zu dieser Kammer befindet. Dabei kann aber die X- und Y-Achse gesondert betrachtet werden.
  //(Siehe Dungeon.setup())
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

  //Die .checkNeighbors() function ermittelt die Anzahl an Nachbarn mit denen sich die Kammer noch nicht verbunden hat und kann einen
  //dieser Nachbarn zurückgeben (Siehe Dungeon.setup())
  this.checkNeighbors = function(returnunvisitedlength) {
    var unvisiteds = []
    for (ci = 0; ci < this.neighbors.length; ci++) {
      if (!this.neighbors[ci][1].visited) {
        unvisiteds.push(ci)
      }
    }
    //Das Array unvisiteds enthält alle nicht besuchten Nachbarn.
    if (returnunvisitedlength) {
      return unvisiteds.length
      //Falls mit returnunvisitedlength gefordert, gibt es die Länge dieses Arrays direkt zurück.
    } else {
      var pathindex = unvisiteds[floor(random(unvisiteds.length))]
      return [this.neighbors[pathindex][1], this.neighbors[pathindex][0]]
      //Sonst gibt es einen zufällig gewählten nicht besuchten Nachbarn zurück (Siehe Dungeon.setup())
    }
  }

  //Die .within() function gibt an, ob sich ein Object mit Koordinaten x, y, innerhalb der Kammer befindet.
  this.within = function(x, y) {
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      return true
    } else {
      return false
    }
  }

  //Die .visible() function gibt an, ob die Kammer aktuell am Bildschirm sichtbar ist (Siehe Dungeon.displayMap()).
  this.visible = function(x, y, w) {
    if (x + (this.x * w) >= -(this.width * w) && y + (this.y * w) >= -(this.height * w) && x + (this.x * w) <= width && y + (this.y * w) <= height) {
      return true
    } else {
      return false
    }
  }


 //update function was modified by matthew to include bottle update
    this.update = function (player) {

    for (di = 0; di < this.monsters.length; di++) {
        this.monsters[di].update(player)
    }
    if (this.item != undefined && this.item.index == "bottle") {
          this.item.update();
    }
    if (this.item != undefined && this.item.index == "bottle" && player.chamber == this) {
      this.item.update();
    }
  }

  //Die .disp() function visualisiert die Kammer, gegebenenfalls ihr Item und alle ihre Monster.
    this.disp = function (x, y, w) {
    var dx = this.width * w / 10
    var dy = this.height * w / 10

        if (this.orientation < .5) {
            for (var i = 0; i < 10; i++) {
                fill(this.col)
                stroke(0, 0, 0, 100)
                strokeWeight(1)
                rect(x + i * dx + (this.x * w), y + (this.y * w), this.width * w / 10, this.height * w)
            }
        } else {
            for (var i = 0; i < 10; i++) {
                fill(this.col)
                stroke(0, 0, 0, 100)
                strokeWeight(1)
                rect(x + (this.x * w), y + i * dy + (this.y * w), this.width * w, this.height * w / 10)
            }
        }   
    stroke(this.wallcol)
    strokeWeight(10)
    fill(0,0,0,0)
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    

      
    for (di = 0; di < this.furniture.length; di++) {
          this.furniture[di].disp(x, y, w)
    }
    if (this.item) {
      this.item.disp(x, y, w)
    }
    for (di = 0; di < this.monsters.length; di++) {
      this.monsters[di].disp(x, y, w)
    }
  }
}


function Bottle(x, y, size, chamber, spawnCount) {
    this.index = "bottle"
    this.chamber = chamber
    this.x = x
    this.y = y
    this.width = size
    this.height = size / 2
    this.r = size / 3.333
    this.rotation = 0
    this.col = [128, 128, 128, 250]
    this.t = 0
    this.spawnCount = spawnCount

    this.update = function () {

        //if (player.chamber === this.chamber) {
        if (this.t % 50 === 0) {
            if (this.spawnCount > 0) {
                console.log("zombie spawned")
                this.chamber.addZombie(1);
                this.spawnCount--;
                console.log(spawnCount)
            }
        }
      //}
        this.t++
    }

    this.within = function (x, y, r) {
        if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
            return true
        } else {return false}
    }

    this.action = function () {
        return
    }

    this.disp = function (x, y, w) {
        translate(x + (this.x * w), y + (this.y * w))
        rotate(this.rotation)
        translate(-(x + (this.x * w)), -(y + (this.y * w)))
        noStroke()
        rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 4) * w)
        stroke(0)
        strokeWeight(1)
        ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
        translate(x + (this.x * w), y + (this.y * w))
        rotate(-this.rotation)
        translate(-(x + (this.x * w)), -(y + (this.y * w)))
    }
}  


//Die folgenden constructerfunction sind Items, die der Spieler auf der Map in Kammern aufsammeln kann.
//Jedes funktioniert ungefähr so:

function Key(x, y, r) {
  this.index = "key"
  this.x = x
  this.y = y
  this.r = r
  this.col = [255, 255, 0, 255]

  //Die .within() function gibt an, ob ein Object mit Koordinaten x, y und Radius r das Item berührt. (Siehe Player.update())
  this.within = function(x, y, r) {
    if (dist(this.x, this.y, x, y) <= this.r + r) {
      return true
    } else {
      return false
    }
  }

  //Die .action() function bestimmt, was passiert, wird das Item vom Spieler aufgesammelt. (Siehe Player.update()
  this.action = function(player) {
    //Bei diesem Item wird die Anzahl der Schlüssel des Spielers um 1 erhöht.
    player.keys++
  }

  //Mit der .disp() function wird das Item auf der Map visualisiert (. (Siehe Chamber.disp()).
  this.disp = function(x, y, w) {
    keyX = x + (this.x * w)
    keyY = y + (this.y * w)
    keyR = this.r * w
    //In diesem Fall geschieht das mit der displayKey() function.
    displayKey(keyX, keyY, keyR, this.col)
  }
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

//Die displayKey() function stellt ein Schlüssel-Symbol an der angegebenen Stelle (x, y) mit der angegebenen Größe (r) und Farbe (col) dar (Siehe Dungeon.dispHub() und Key.disp()).
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

function Bottle(x, y, size, chamber) {
    this.index = "bottle"
    this.chamber = chamber
    this.x = x
    this.y = y
    this.width = size
    this.height = size / 2
    this.r = size / 2
    this.rotation = 0
    this.col = [4, 224, 208, 255]
    this.t = 0
    this.spawnRate = 100
    this.closed = false

    this.update = function (player) {
      if (this.closed == false) {
        if (this.t % this.spawnRate === 0) {
          //if (this.spawnCount > 0) {
            	this.chamber.addZombie(1);
              //this.spawnCount--;
          //}
        }
      }
      this.t++
    }

    this.within = function (x, y, r) {
        if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
            return true
        } else {
            return false
        }
    }

    this.action = function() {
      if (this.closed == false) {
        this.closed = true
        animations.push(new TextAnimation("You closed the lid!"))
      }
    }

    this.disp = function (x, y, w) {
        translate(x + (this.x * w), y + (this.y * w))
        rotate(this.rotation)
        translate(-(x + (this.x * w)), -(y + (this.y * w)))
        //noStroke()
        //rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 4) * w)
        stroke(0)
        strokeWeight(1)
        if (this.closed == false) {
          fill(50, 50, 255, 255)
        } else {
          fill(50, 50, 50, 255)
        }
        ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
        translate(x + (this.x * w), y + (this.y * w))
        rotate(-this.rotation)
        translate(-(x + (this.x * w)), -(y + (this.y * w)))
    }
}

function Sink(x, y, w) {
  this.index = "sink"
  this.x = x - (w / 2)
  this.y = y - (w / 2)
  this.width = w
  this.height = w
  this.col = [55, 55, 55, 255]
  this.symbolcol = [10, 10, 255, 255]
  this.used = false

  this.within = function(x, y, r) {
    if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
      return true
    } else {
      return false
    }
  }

  this.action = function(player) {
    if (this.used == false) {
      player.lives = player.maxlives
      this.used = 255
      animations.push(new TextAnimation("You washed your hands!"))
    }
  }

  this.disp = function(x, y, w) {
    noStroke()
    fill(this.col)
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    if (typeof this.used == "number") {
      this.used -= 2
      this.symbolcol[3] = this.used
      if (this.used < 0) {
        this.used = true
      }
    }
    if (this.used != true) {
      fill(this.symbolcol)
      rect(x + (this.x * w) + (this.width * w) / 10, y + (this.y * w) + (this.height * w) / 10, this.width * (8/10) * w, this.height * (8/10) * w)
    }
  }
}

function Desk(x, y, w, orientation) {
    this.index = "desk"
    this.x = x //- (w / 2)
    this.y = y //- (w / 2)
    this.orientation = orientation
    if (this.orientation == "horizontal") {
        this.width = w 
        this.height = w * .5
    }
    if (this.orientation == "vertical") {
        this.width = w * .5
        this.height = w 
    }
    this.col = [106,75,	53, 255]

    this.within = function (x, y, r) { 
        if (x >= this.x - r && y >= this.y - r && x <= this.x + this.width + r && y <= this.y + this.height + r) {
            return false
        } else {
            return false
        }

        return false
    } 

    this.action = function (player) {
        if (this.used == false) {
           return
        }
    }

    this.disp = function (x, y, w) {
        stroke(0)
        strokeWeight(1)
        fill(this.col)
        rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)    
    }
}
