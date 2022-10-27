//Das player.js Skript enthält die Player() constructerfunction mit der die Spielfigur gesteuert und visualisiert wird.
function Player() {
  this.chamber = new Chamber(0,0,0,0,0,0)
  this.x = 0
  this.y = 0
  this.width = 0.01
  this.height = 0.005
  this.r = 0.003
  this.rotation = 0
  this.pointingAt = [0, 0]

  this.col = [50, 255, 50, 255] // this.col = [50, 50, 255, 255]

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

  //Mit der .resize() function kann die Größe der Spielfigur der Map angepasst werde. Sie betrifft auch seine Gehgeschwindigkeit
  //und die Größe seiner Waffe (Siehe Gun(1-5).resize())
  this.resize = function(size) {
    this.width = size
    this.height = size / 2
    this.r = size / 3.333
    this.walkingspeed = size / 8
    this.gun.resize(size)
  }

  //Die .goToChamber() befördert den Spieler in eine bestimmte Kammer (cahmber).
  this.goToChamber = function(chamber, px, py) {
    this.chamber = chamber
    if (px && py) {
      //Sind die Variabeln px, py definiert kann seine Position direkt bestimmt werden (Siehe Connection.check())
      this.x = px
      this.y = py
    } else {
      this.x = chamber.m[0]
      this.y = chamber.m[1]
    }
  }

  //Die .hit() function bestimmt, was passiert wenn der Spieler von einem Monster attakiert wird.
  this.hit = function(minuslives) {
    this.lives -= minuslives
    //Die Variabel minuslives bestimmt wie viele Leben dem Spieler abgezogen werden.
    this.hitted = 2
    //Die .hitted Variabel bewirkt, dass die Spielfigur nach einem Treffer kruz rot gefärbt wird.
  }

  //Die .shoot() function wird aufgerufen, wenn der Spieler schießt und leitet entsprechende Reaktionen ein. (Siehe mousePressed())
  this.shoot = function() {
    if (this.ammo > 0 && (this.t - this.lastshot) > this.gun.shootingspeed) {
      //Der Spieler kann natürlich nur schießen wenn er genügend Munition (.ammo) hat. Die Variabel .lastshot gibt an, wann er das letzte
      //Mal schoss. Er kann nur erneut schießen wenn die Nachladezeit seiner Waffe (.gun.shootingspeed) bereits abgelaufen ist.
      this.gun.shoot()
      //Siehe Gun(1-5).shoot()
      this.ammo--
      this.lastshot = this.t
    }
  }

  //Die .within() function gibt an, ob ein Objekt mit den Koordinaten x, y und dem Radius r die Spielfigur berührt.
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
      //Nachdem überprüft wurde, ob der runde Kop der Spielfigur berührt wurde, wird der abgerundet rechteckige Rumpf überprüft
      var circles = 5
      var circledist = (this.width - this.height) / (circles - 1)
      var vec1 = turnVector(createVector(100, 0), map(this.rotation, 0, TWO_PI, 360, 0))
      vec1.setMag((this.width / 2) - (this.height / 2))
      var position = createVector(this.x, this.y)
      var acpoint = p5.Vector.add(position, vec1)
      var movevec = vec1
      movevec.mult(-1)
      movevec.setMag(circledist)
      //Dies geschiet mit mehreren Kreisen, die in den Rumpf bildlich gesprochen eingeschleust werden.
      for (wi = 0; wi < circles; wi++) {
        if (typeof(r) === "undefined") {
          if (dist(acpoint.x, acpoint.y, x, y) <= this.height / 2) {
            //Ist der Abstand vom Mittelpunkt einer der Kreise im Rumpf zum den x, y Koordinaten kleiner dem Radius des Kreises
            //(der die Kanten des Rumpfes berührt) und gegebenenfalls dem zweiten Radius r, berührt das Objekt den Kreis und damit
            //den Rumpf der Spielfigur
            return true
          }
        } else {
          if (dist(acpoint.x, acpoint.y, x, y) <= (this.height / 2) + r) {
            return true
          }
        }
        acpoint.add(movevec)
      }
      //Das wird für eine von der Variabel circles festgelegte Anzahl an Kreisen gemacht (umso mehr Kreise umso genauer).
      //Wird keiner der Kreise berührt kehrt die function mit "false" zurück.
      return false
    }
  }

  //Die .update() function steuert den Spieler, überprüft, ob der Spieler ein Item berührt (Siehe Key()) und steuert seine Waffe an.
  this.update = function() {
    //this.move() // --- this.move() is now called by the GameMode object, dungeon.gamemode!
    //Siehe .move()
    if (this.chamber.item) {
      if (this.chamber.item.within(this.x, this.y, this.width / 2)) {
        //Berührt der Spieler ein Item, wird die Aktion des Items ausgeführt (Siehe Key.action()) und das Item von der Kammer entfernt.
        this.chamber.item.action(this)
        if (this.chamber.item.index != "sink" && this.chamber.item.index != "bottle") {
          this.chamber.item = undefined
        }
      }
    }
    this.gun.update()
    //Siehe Gun(1-5).update()
    this.t++
  }

  //Die .move() function bewegt den Spieler über das Spielfeld.
  this.move = function() {
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
    //Wird die Taste W, A, S ode D gedrückt, bewegt sich der Spieler nach oben, links, unten oder rechts.
    if (this.x < this.chamber.x) {
      this.x = this.chamber.x
    } else if (this.x > this.chamber.x + this.chamber.width) {
      this.x = this.chamber.x + this.chamber.width
    }
    //Verlässt er die Kammer entlang der X-Achse, wird die .x Variabel des Spielers auf einen an die Kammer grenzenden Wert
    //zurückgesetzt. Dasselbe gilt für die Y-Achse:
    if (this.y < this.chamber.y) {
      this.y = this.chamber.y
    } else if (this.y > this.chamber.y + this.chamber.height) {
      this.y = this.chamber.y + this.chamber.height
    }
  }

  this.disp = function(x, y, w, pointAtX, pointAtY) {
    if (this.posessing) {
      this.dispDot(x, y, w)
    } else {
      this.pointingAt = [(pointAtX - x) / w, (pointAtY - y) / w]
      var vec1 = createVector(pointAtX - (x + (this.x * w)), pointAtY - (y + (this.y * w)))
      this.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
      this.dispNormal(x, y, w)
    }
  }

  this.dispDot = function(x, y, w) {
      fill(this.col)
      noStroke()
      ellipse(x + (this.x * w), y + (this.y * w), this.r * w)
  }

  //Die .disp() function visualisiert den Spieler.
  this.dispNormal = function(x, y, w) {
    this.gun.disp(x, y, w)
    translate(x + (this.x * w), y + (this.y * w))
    rotate(this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
    if (this.hitted && this.hitted > 0) {
      //Wurde er kürzlich getroffen, wird der Spieler rot gefärbt. (Siehe .hit())
      fill(255, 0, 0)
      this.hitted--
    } else {
      fill(this.col)
      this.hitted = false
    }
    noStroke()
      rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w), this.width * w, this.height * w, (this.height / 2) * w)
      //rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w + 4), this.width * w, this.height * w / 4, (this.height / 4) * w)
      //rect(x + ((this.x - this.width / 2) * w), y + ((this.y - this.height / 2) * w + 8), this.width * w, this.height * w / 4, (this.height / 4) * w)
    stroke(0)
    strokeWeight(1)
    ellipse(x + (this.x * w), y + (this.y * w), this.r * 2 * w, this.r * 2 * w)
    translate(x + (this.x * w), y + (this.y * w))
    rotate(-this.rotation)
    translate(-(x + (this.x * w)), -(y + (this.y * w)))
  }
}
