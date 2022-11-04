//Das Connection.js Skript verwahrt die Connection() constructerfunction, die die Verbindungen zwischen den Kammern
//festhält und visualisiert.
function Connection(chambera, chamberb, direction, pathweight) {
  //Die .chamberA und .chamberB Variable der constructerfunction speichert die Kammern, zwischen denen die function eine Verbinung
  //schafft. Diese Verbinung wird dem .connections Array der jeweiligen Kammern auch sogleich hinzugefügt. (Siehe Chamber())
  this.chamberA = chambera
  this.chamberA.connections.push([this, chamberb])
  this.chamberB = chamberb
  this.chamberB.connections.push([this, chambera])
  this.pathweight = pathweight
  this.enterPointA = []
  this.enterPointB = []
  //Danach wird festgelegt, wo der Spieler auf beiden Seiten die Verbindung betritt und verlässt. Diese Punkte werden in den
  //Arrays .enterPointA, .enterPointB, .accesPointA und .accesPointB gepsiechert.
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

  //Während diesem Prozess wird auch die genaue Position der Verbindung festgelegt. Ist die Verbindung waagerecht
  //(verbindet 2 Kammern die entlang der X-Achse nebeneinander liegen) wird die die .y Variable der Verbindung
  //aus allen möglichen Optionen zufällig gewählt, ist sie senkrecht, wird die .x Variable zufällig gewählt.
  //Damit wirkt der Dungeon kofuser und verwirrender. Zuletzt werden noch die Farben des Verbindung und ob sie gesperrt
  //ist oder nicht festgelegt.

  this.lockedcol = [255, 255, 0, 255]
  this.locked = false

  //Die .check() function überprüft, ob der Spieler gerade versucht diese Verbindung zu passieren und reagiert entsprechend.
  //(Siehe Dungeon.update())
  this.check = function(player) {
    if (player.posessing) {
      return undefined
    }
    if (player.chamber === this.chamberA) {
      //Befindet der Spielr sich in .chamberA, überprüft die function seinen Abstand zum accesPoint der .chamberA (.accesPointA).
      if (dist(player.x, player.y, this.accesPointA[0], this.accesPointA[1]) <= this.pathweight / 2) {
        //Ist dieser gering genug..
        if (!this.locked || player.keys > 0) {
          //und die Verbindung nicht gesperrt beziehungsweise der Spieler im Besitz von Schlüsseln, kann er die Verbindung passieren.
          player.goToChamber(this.chamberB, this.enterPointB[0], this.enterPointB[1])
          //Siehe Player.goToChamber()
          if (this.locked) {
            //Ist die Verbindung gesperrt, wird dem Spieler ein Schlüssel abgezogen und die Verbindung entsperrt.
            player.keys--
            this.locked = false
          }
          //Danach wird die Animation von der aktuellen Kammer des Spielers (.chamberA) zu der, zu der die Verbindung hinführt
          //(.chamberB) errrechnet.
          var duration = floor(dist(this.chamberA.m[0], this.chamberA.m[1], this.chamberB.m[0], this.chamberB.m[1]) / (player.walkingspeed * 6))
          //Die Dauer der Animation (duration) ergibt sich aus der Entfernung zwischen den beiden Kammern. Mit ihrer Hilfe werden dann die
          //die Geschwindigkeiten berrechnet, mit denen sich das Sichtfeld bei der Animation der X- und Y-Achse entlang bewegen sollte
          //(vecX und vecY). Diese Informationen werden dann zurückgegeben (an die .update() function des Dungeons (Siehe Dungeon.update())).
          var vecX = (this.chamberB.m[0] - this.chamberA.m[0]) / duration
          var vecY = (this.chamberB.m[1] - this.chamberA.m[1]) / duration
          return [duration, vecX, vecY]
        }
      }
    } else if (player.chamber === this.chamberB) {
      //Befindet sich der Spieler in .chamberB, passiert dasselbe wie vorher nur umgekehrt.
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
    //Passiert der Spieler keine Verbindung wird "undefined" zurückgegeben
    return undefined
  }

  //Die .disp() function visualisiert die Verbindung.
  this.disp = function(x, y, w) {
    if (this.locked) {
      fill(this.lockedcol)
    } else {
      fill(this.col)
    }
    noStroke()
    rect(x + (this.x * w), y + (this.y * w), this.width * w, this.height * w)
    fill(255)
  }
}
