//Das monsters.js Skript enthält die constructerfunctions der Monster des Dungeons, die diese steuern und visualisieren.
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
  this.col = [50, 50, 255, 255] // this.col = [0, 255, 0, 255]
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

  //Die .hit() function bestimmt, was passiert wenn ein Zombie vom Spieler getroffen wird.
  this.hit = function(minuslives) {
    this.lives -= minuslives
    //Die Variabel minuslives bestimmt wie viele Leben dem Zombie abgezogen werden.
    this.hitted = 2
  }

  //Die .within() function gleicht der des Spielers (Siehe Player.within())
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

  //Die .update() function steuert den Zombie.
  this.update = function(player) {
    if (this.t % 2 === 0) {
      //Als langsames Wesen bewegt sich ein Zombie nur alle 2 Frames fort.
      if (player.chamber === this.chamber) {
        //Befindet sich der Spieler in der Kammer des Zombies...
        this.pointingAt = [player.x, player.y]
        var vec1 = createVector(player.x - this.x, player.y - this.y)
        this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
        //zielt der Zombie auf ihn.
        this.rotation += random(-PI / 10, PI / 10)
        //Allerdings nicht genau sondern mit einer leichten Abweichung.
        var vec1 = createVector(this.walkingspeed, 0)
        vec1 = turnVector(vec1, map(-this.rotation + PI/2, 0, TWO_PI, 0, 360))
        //Entsprechend seiner Ausrichtung bewegt er sich dann.
        this.x += vec1.x
        this.y += vec1.y
      } else {
        //Befindet sich der Spieler nicht in der Kammer des Zombies ändert er seine Bewegungsichtung zufällig
        if (random(1) < 0.05) {
          this.rotation = random(0, TWO_PI)
        }
        var vec1 = createVector(this.walkingspeed, 0)
        vec1 = turnVector(vec1, map(-this.rotation + PI/2, 0, TWO_PI, 0, 360))
        this.x += vec1.x
        this.y += vec1.y
        //und bewegt sich entsprechend dieser fort.
        if (this.x < this.chamber.x || this.y < this.chamber.y || this.x > this.chamber.x + this.chamber.width || this.y > this.chamber.y + this.chamber.height) {
          this.rotation += PI
          this.rotation = this.rotation % TWO_PI
          //Berührt der Zombie den Rand seiner Kammer, speigelt er seine Bewegung in die andere Richtung.
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
      //Ähnlich dem Spieler verhindert der Zombie aus der Kammer zu schlüpfen indem er immer überprüft ob er ihren Rand berührt
      //(Siehe Player.update()).
      if ((this.t - this.lasthit) > this.hittingspeed && dist(this.x, this.y, player.x, player.y) < this.r + player.r) {
        //Die .lasthit Variabel speichert, wann der Zombie zuletzt den Spieler schlug. Ist dies lange genug her (länger as .hittingspeed)
        //und er ist dem Spieler nahe genug, schlägt er ihn.
        player.hit(this.minuslives)
        //Siehe Player.hit()
        this.lasthit = this.t
      }
      if (this.lives <= 0) {
        //Stirbt der Zombie (hat also keine Leben mehr), bekommt der Spieler sein Cash und der Zombie entfernt sich selbst aus dem
        //.monster Array seiner Kammer (Siehe Chamber()).
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

  //Die .disp() function gleicht der des .disp() function des Spielers (Siehe Player.disp())
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

//Die constructerfunction des Rippers gleicht der des Zombies bis auf die .update() function und ein paar Variabeln - der Ripper hat
//zum Beispiel eine Waffe (Siehe GunR(1-3)()).
function Ripper(x, y, size, chamber, gun) {
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
  if (gun === 1) {
    this.gun = new GunR1(this)
  } else if (gun == 2) {
    this.gun = new GunR2(this)
  } else if (gun == 3) {
    this.gun = new GunR3(this)
  } else if (gun == 4) {
    this.gun = new Mouth(this)
  }
  this.gun.resize(this.chamber.pathweight)
  this.t = 0
  this.lastshot = -1000
  this.hitted = false

  this.cash = 50
  this.instantcash = 10
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

  //Die .update() function steuert den Ripper.
  this.update = function(player) {
    if (this.t % 2 === 0) {
      //Er bewegt sich wieder Zombie nur alle 2 Frames (allerdings aus Respekt vor dem Spieler)
      if (player.chamber === this.chamber) {
        //Befindet der Spieler sich in seiner Kammer zielt er auf ihn.
        this.pointingAt = [player.x, player.y]
        var vec1 = createVector(player.x - this.x, player.y - this.y)
        this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
        //Er bewegt sich allerdings unabhängig davon
        if (this.speedX === 0 && this.speedY === 0) {
          if (random(1) < 0.005) {
            //mit einer gewissen Wahrscheinichkeit zufälig
            var vec1 = createVector(random(1), random(1))
            vec1.setMag(this.walkingspeed)
            this.speedX = vec1.x
            this.speedY = vec1.y
          }
        } else {
          this.x += this.speedX
          this.y += this.speedY
          if (random(1) < 0.0075) {
            //und mit einer gewissen Wahrscheinichkeit gar nicht.
            this.speedX = 0
            this.speedY = 0
          }
        }
        if ((this.t - this.lastshot) > this.gun.shootingspeed) {
          //Auch er hat eine Nachladezeit ähnlich dem Spieler (Siehe Player.shoot())
          this.gun.shoot()
          //Siehe GunR(1-3).shoot()
          this.lastshot = this.t
        }
      } else {
        //Befindet sich der Spieler nicht im selben Raum bewegt sich der Ripper gleich dem Zombie
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
    this.gun.disp(x, y, w)
  }
}


function Human(x, y, size, chamber, gun, type) {
  this.index = "human"
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
  this.col = [Math.floor(random() * 255), Math.floor(random() * 255), Math.floor(random() * 255),255]
  this.walkingspeed = size / 8
  this.type = type

   
  if (gun == 4) {
    this.gun = new Mouth(this)
    this.gun.resize(this.chamber.pathweight)
  } else {
    this.gun = null
  }
  this.t = 0
  this.lastshot = -1000
  this.hitted = 0
  this.posessed = false

  this.cash = 50
  this.instantcash = 10
  this.maxlives = 5
  this.lives = 5

  this.hit = function(minuslives) {
    this.lives -= minuslives
    this.hitted++
    if (this.hitted >= 5 && this.gun == null) {
      this.gun = new Mouth(this)
      this.gun.resize(this.chamber.pathweight)
    }
  }

  this.within = function(x, y, r) {
    if (dist(this.x, this.y, x, y) <= (this.width + this.height) / 2) {
      if (typeof(r) === "undefined") {
        print("something is checking human's within")
        if (dist(this.x, this.y, x, y) <= this.r) {
          return true
        } else {
          return false
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

  //Die .update() function steuert den Ripper.
  this.update = function(player) {
    if (this.posessed) {
      return
    }
    if (this.t % 2 === 0) {
      //Er bewegt sich wieder Zombie nur alle 2 Frames (allerdings aus Respekt vor dem Spieler)
      if (player.chamber === this.chamber) {
        //Befindet der Spieler sich in seiner Kammer zielt er auf ihn.
        this.pointingAt = [player.x, player.y]
        var vec1 = createVector(player.x - this.x, player.y - this.y)
        this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
        //Er bewegt sich allerdings unabhängig davon
        if (this.speedX === 0 && this.speedY === 0) {
          if (random(1) < 0.005) {
            //mit einer gewissen Wahrscheinichkeit zufälig
            var vec1 = createVector(random(1), random(1))
            vec1.setMag(this.walkingspeed)
            this.speedX = vec1.x
            this.speedY = vec1.y
          }
        } else {
          this.x += this.speedX
          this.y += this.speedY
          if (random(1) < 0.0075) {
            //und mit einer gewissen Wahrscheinichkeit gar nicht.
            this.speedX = 0
            this.speedY = 0
          }
        }
        if (this.gun !== null) {
          if ((this.t - this.lastshot) > this.gun.shootingspeed) {
            //Auch er hat eine Nachladezeit ähnlich dem Spieler (Siehe Player.shoot())
            this.gun.shoot()
            //Siehe GunR(1-3).shoot()
            this.lastshot = this.t
          }
        }
      } else {
        //Befindet sich der Spieler nicht im selben Raum bewegt sich der Ripper gleich dem Zombie
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
      /*if (this.lives <= 0) {
        player.cash += this.cash
        for (ui = 0; ui < this.chamber.monsters.length; ui++) {
          if (this.chamber.monsters[ui] === this) {
            this.chamber.monsters.splice(ui, 1)
          }
        }
      }*/
    }
    if (this.gun !== null) {
      this.gun.update()
    }
    this.t++
  }

    this.disp = function (x, y, w) {
        if (!this.posessed) {
          translate(x + (this.x * w), y + (this.y * w))
          rotate(this.rotation)
          translate(-(x + (this.x * w)), -(y + (this.y * w)))
          noStroke()
          fill(this.col)
          rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 4) * w)
          fill(map(this.hitted, 0, 5, 232, 0), map(this.hitted, 0, 5, 190, 255), map(this.hitted, 0, 5, 172, 0))
          stroke(0)
          strokeWeight(1)
          ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
          translate(x + (this.x * w), y + (this.y * w))
          rotate(-this.rotation)
          translate(-(x + (this.x * w)), -(y + (this.y * w)))
          if (this.gun !== null) {
            this.gun.disp(x, y, w)
          }
        } else {
          this.pointingAt = [(mouseX - x) / w, (mouseY - y) / w]
          var vec1 = createVector(mouseX - (x + (this.x * w)), mouseY - (y + (this.y * w)))
          this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
          // Exact same as above, so maybe refactor into a dispNormal method
          translate(x + (this.x * w), y + (this.y * w))
          rotate(this.rotation)
          translate(-(x + (this.x * w)), -(y + (this.y * w)))
          noStroke()
          fill(this.col)
          rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 4) * w)
          fill(map(this.hitted, 0, 5, 232, 0), map(this.hitted, 0, 5, 190, 255), map(this.hitted, 0, 5, 172, 0))
          stroke(0)
          strokeWeight(1)
          ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
          translate(x + (this.x * w), y + (this.y * w))
          rotate(-this.rotation)
          translate(-(x + (this.x * w)), -(y + (this.y * w)))
          if (this.gun !== null) {
            this.gun.disp(x, y, w)
          }
        }
    }
}



