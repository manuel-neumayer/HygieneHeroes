function Dungeon() {
  this.level = 1
  this.player = new Player()
  this.w = height
  this.x = 0
  this.y = 0
  this.w = height
  this.randNumArrayX = [];
  this.randNumArrayY = [];
    for (i = 0; i < 100; i++) {
        if (Math.random() * 2 == 1) { randomsignx = -1 }
        else { randomsignx = 1 }
        if (Math.random() * 2 == 1) { randomsigny = -1 }
        else { randomsigny = 1 }
        this.randNumArrayX[i] = Math.random() * 2800 * randomsignx
        this.randNumArrayY[i] = randomy = Math.random() * 2800 * randomsigny
    }

  this.setup = function(nofchambers) {
    //Die setup() function generiert ein gesamtes Level, initialisiert also die gsamte Map (Kammern und Monster) und den Spieler selbst.
    this.game = true
    this.t = 0
    this.fixedview = true
    this.animation = false
    this.chambers = []
    this.numberofchambers = nofchambers
    this.connections = []
    //Nach Festlegung der Anzahl an Kammern wird zuerst die Map erstellt. Das geschieht in 4 Schritten:
    //Schritt 1
    var sidelength = sqrt(1 / this.numberofchambers)
    this.sidelengths = [sidelength * 0.5, sidelength * 0.9]
    this.pathweight = this.sidelengths[1] * 0.05
    this.player.resize(this.pathweight)
    this.items = [new AidUpgrade(), new AmmoUpgrade(), new BuyKeys(), new Gun1(undefined, this.pathweight), new Gun2(undefined, this.pathweight), new Gun3(undefined, this.pathweight), new Gun4(undefined, this.pathweight), new Gun5(undefined, this.pathweight)]
    //Als erstes wird die Variabel .sidelengths festgelegt. Sie gibt den Maximal- und Minimalwert der Kammernseitenlängen an.
    //Die .pathweight Variabel legt später die Breite der Verbindungen zwischen den Kammern fest. Eine Verbindung zwischen zwei Kammern ist der Weg,
    //über den ein Spieler später von einer Kammer zur nächsten gelangen kann. Zu Bedenken ist, dass hier noch keine richtigen Distanzen festgelegt werden,
    //die Map ist vorerst 1 * 1 groß - alle Variabeln die Position ind Größe von etwas angeben sind also vorerst reativ. Wie groß etwas dargestelt wird,
    //wird erst in den jeweiligen functions (siehe Dungeon.disp() und Chamber.disp()).
    //Im folgenden for() Loop werden nun erstmal die Kammern initialisiert:
    for (i = 0; i < this.numberofchambers; i++) {
      var searching = 0
      while (searching !== false) {
        //Dieser while() Loop sucht nach passenden Größen und Positionen für die neuen Kammern.
        var newwidth = random(this.sidelengths[0], this.sidelengths[1])
        var newheight = random(this.sidelengths[0], this.sidelengths[1])
        var newx = random(0, 1 - newwidth)
        var newy = random(0, 1 - newheight)
        //Nachdem eine mögliche Breite und Höhe sowie eine Position für die neue Kammer generiert wurde, überprüft der nävhste for() Loop ob,
        //die Kammer am der zufällig gewählten Stelle Platz hat, sich dort alos nicht mit einer anderen, bereits exisiterenden Kammer überschneidet.
        var intersecting = false
        for (i1 = 0; i1 < this.chambers.length; i1++) {
          if (this.chambers[i1].intersect(newx, newy, newwidth, newheight, this.pathweight)) {
            //Siehe Chamber.intersect()
            intersecting = true
            i1 = this.chambers.length
          }
        }
        if (!intersecting) {
          //Überschneidet sich die Kammer an der gewählten Stelle mit keiner anderen, wird der while() Loop verlassen und die Kammer initialisiert.
          searching = false
        } else {
          searching++
          if (searching >= 10000) {
            searching = false
          }
        }
        }
    //changed to add bottles instead of zombies from matthew
      if (!intersecting) {
        var newchamber = new Chamber(i, newx, newy, newwidth, newheight, this.pathweight)
        newchamber.addBottle(floor(random(6)))
        this.chambers.push(newchamber)
      }
      //Siehe Chamber()
    }
    //Das .chambers Array ist nun mit der von .numberofchambers fesgelegten Zahl an Kammern gefüllt. Es folgt
    //Schritt 2
    //In diesem Schritt werden mit folgendem for() Loop werden für jede Kammer die Nachbarn, aso die am nähsten stehenden Kammern,
    //mit denen eine Verbindung möglich ist, gesucht.
    for (i = 0; i < this.chambers.length; i++) {
      var chamber = this.chambers[i]
      //Die Variable chamber ist die Kammer, deren Nachbanfr wir akutell suchen.
      var neighbors = [[], [], [], [], []]
      //In die iIndexe [0, 1, 2, 3] des neighbors Array füllen wir alle möglichen Nachbarn, sortiert nach ihrer Position relativ zur chamber.
      //Dazu gehen wir erneut durch das gesamte .chambers Array.
      for (i1 = 0; i1 < this.chambers.length; i1++) {
        if (this.chambers[i1].i !== chamber.i) {
          //Die chamber selbst lassen wir natürlich aus
          if (this.chambers[i1].intersect(chamber.x, chamber.y, chamber.width, chamber.height, -this.pathweight, false, true)) {
            //Siehe Chamber.intersect()
            if (this.chambers[i1].x - chamber.x >= 0) {
              neighbors[0].push(i1)
              //In Index 0 des neighbors Array füllen wir die möglichen Nachbanr links der chamber
            } else {
              neighbors[1].push(i1)
              //In Index 0 des neighbors Array füllen wir die möglichen Nachbanr rechts der chamber
            }
          } else if (this.chambers[i1].intersect(chamber.x, chamber.y, chamber.width, chamber.height, -this.pathweight, true)) {
            if (this.chambers[i1].y - chamber.y >= 0) {
              neighbors[2].push(i1)
              //In Index 0 des neighbors Array füllen wir die Nachbanr unterhalb der chamber
            } else {
              neighbors[3].push(i1)
              //In Index 0 des neighbors Array füllen wir die Nachbanr oberhalb der chamber
            }
          }
          //Mögliche Nachbarn sind dabei alle jene Kammern, die mit der chamber entweder auf der X- oder Y-Achse auf gleicher Höhe sind.
        }
      }
      //Von den möglichen Nachbarn der chamber suchen wir nun die, die ihr in positive und negative X- und Y-Richtung
      //(also links, rechts, oberhalb und unterhalb) am nächsten sind.
      //Wir durchsuchen dazu mit dem folgenden for() Loop die nach den Richtungen sortierten Indexe [0, 1, 2, 3] des neighbors Arrays.
      for (i1 = 0; i1 < 4; i1++) {
        if (neighbors[i1].length > 0) {
          var nearestdist = 10
          var nearest = undefined
          //Nun ermitteln wir im jeweiligen Array des neighbors Arrays die zur chamber nähsten Kammer.
          for (i2 = 0; i2 < neighbors[i1].length; i2++) {
            var index = neighbors[i1][i2]
            var distance = dist(chamber.m[0], chamber.m[1], this.chambers[index].m[0], this.chambers[index].m[1])
            if (distance < nearestdist) {
              nearestdist = distance
              nearest = [i1, this.chambers[index]]
            }
          }
          //Diese pushen wir im oben initialisiertem Array nearest in den Index 4 des neighbors Arrays.
          //Das nearest Array beschreibt im Index 0 die Orientierung des gewählten (also nähsten) Nachbarn
          //(0 = links, 1 = rechts, 2 = unterhalb, 3 = oberhalb) und enthält im Index 1 die gewählte Kammer selbst.
          neighbors[4].push(nearest)
        }
      }
      //Zum Schluss werden die ausgewählten Nachbarn an die chamber weitergegeben.
      chamber.neighbors = neighbors[4]
      if (neighbors[1].length === 0 && neighbors[3].length === 0) {
        this.startchamber = chamber
      } else if (neighbors[0].length === 0 && neighbors[2].length === 0) {
        this.endchamber = chamber
      }
    }
    //Jeder Kammer sind jetzt also ihre Nachbarn zugewiesen. Es folgt
    //Schritt 3
    //In diesem Schritt wird entscheiden, zu welcher ihrer Nachbarn die einzelen Kammern auch tatsächlich Verbindungen erhalten.
    //Dabei entsteht bereits ein Labyrinth, das garantiert, dass man von jeder Kammer Verbindungen in jede andere Kammern exisiteren.
    //Hierzu dient uns folgender Algorithmus:
    //Als erstes wählen wir eine zufällige Kammer aus (Die Kammer mit dem Index 0 im .chambers Array befindet sich immer wo anders)
    //und speichern sie als die Variabel current. Außerdem bereiten wir das Array leftchambers vor.
    //Danach betreten wir einen while() Loop:
    var current = this.chambers[0]
    var leftchambers = []
    var settingup = true
    while (settingup) {
      //Der while() Loop läuft bis zur Fertigstellung des durch Schritt 3 resultierendes Labyrinths. Als erstes markiert er die aktulle Kammer (current)
      //als "besucht".
      current.visited = true
      //Nun ermitteln wir mit der checkNeighbors() function (Siehe Chamber.checkNeighbors()) die Anzahl der noch nicht besuchten Nachbarn von current
      var currentneighbors = current.checkNeighbors(true)
      //Hat current nicht besuchte Nachbarn...
      if (currentneighbors > 0) {
        if (currentneighbors > 1) {
          leftchambers.push(current)
        }
        //Generieren wir mit der checkNeighbors() function eine Verbindung zu einem der unbesuchten Nachbarn
        //und legen diesen Nachbarn nun als die aktulle Kammer (current) fest (siehe Chamber.checkNeighbors()).
        //Hat current auch noch mehr als einen noch nicht besuchten Nachbarn, wird die aktulle Kammer in der vorigen if() function außerdem in das leftchambers Array
        //gepusht (und damit für später vorgemerkt).
        newcurrent = current.checkNeighbors()
        this.connections.push(new Connection(current, newcurrent[0], newcurrent[1], this.pathweight))
        current = newcurrent[0]
      } else {
        //Hat current keine nicht besuchten Nahcbarn und es gibt noch vorgemerkte  Kammern (das leftchambers Array ist also nicht leer)...
        if (leftchambers.length > 0) {
          //wird current als eine der Kammern mit noch nicht besuchten Nachbarn festgelegt.
          current = leftchambers.pop()
        } else {
          //Gibt es keine vorgemerkten Kammern (also Kammern mit noch nicht besuchten Nachbarn) mehr, ist der Algorithmus abgeschlossen und
          //wir verlassen den while() Loop.
          settingup = false
        }
      }
    }
    //Nun haben wir ein Array (.chambers) mit zufällig platzierten Kammern, die in Form eines alle Kammern verbindenen Labyrinths miteinander verbunden sind.
    //Es folgt der letzte Schritt zur Generierung der Map:
    //Schritt 4
    //In diesem Schritt wird eine bestimmte Anzahl gesperrter Verbindungen zwischen den Kammern generiert. Um diese gesperrten Verbindungen zu passieren,
    //benötigt der Spieler später einen Schlüssel. Die Anzahl der gesperrten Verbindungen steht in direktem Verhältnis zur Anzahl an Kammern (1 / 3).
    //Sie werden in folgendem for() Loop generiert:
    for (i = 0; i < floor(this.numberofchambers / 3); i++) {
      var searching = true
      //Im folgendem while() Loop wird zuerst eine mögliche Stelle für eine der gesperrten Verbindungen gesucht.
      while (searching) {
        var index = floor(random(this.chambers.length))
        //Dazu wird zuerst der Index einer zufälligen Kammer im .chambers Array gewählt (index). Mit dem folgenden for() Loop werden dann alle Nahcbarn der
        //Kammer gewählt und überprüft, ob sie mit der ausgewählten Kammer in .chambers[index] bereits verbunden sind.
        for (i1 = 0; i1 < this.chambers[index].neighbors.length; i1++) {
          var unconnected = true
          //Für jeden Nahcbarn der .chambers[index]-Kammer werden also alle im .connections Array des Nachbarn (siehe Chamber.setupPaths()) gespeicherte
          //Verbindungen überprüft.
          for (i2 = 0; i2 < this.chambers[index].connections.length; i2++) {
            if (this.chambers[index].connections[i2][1].i === this.chambers[index].neighbors[i1][1].i) {
              unconnected = false
              i2 = this.chambers[index].connections.length
            }
          }
          //Führt keine der Verbindungen des Nachbarn zur -chambers[index]-Kammer, kann von der chambers[index]-Kammer zum gerade überprüften Nachbarn
          //eine (gespeicherte) Verbindung eingegangen werden.
          if (unconnected) {
            //Dies geschieht mit der .setupPaths() function der chambers[index]-Kammer (siehe Chamber.setupPaths())
            var newconnection = new Connection(this.chambers[index], this.chambers[index].neighbors[i1][1], this.chambers[index].neighbors[i1][0], this.pathweight)
            newconnection.locked = true
            this.connections.push(newconnection)
            //Danach wird der for() Loop und der while() Loop verlassen.
            i1 = this.chambers[index].neighbors.length
            searching = false
          }
        }
      }
    }
    for (i = 0; i < floor(this.chambers.length / 3); i++) {
      var index = floor(random(this.chambers.length))
      this.chambers[index].addKey()
    }
    for (i = 0; i < (this.chambers.length); i++) {
      var index = floor(random(this.chambers.length))
      this.chambers[index].addSink()
    }    
    for (i = 0; i < ceil(this.chambers.length / 15); i++) {
      //this.chambers[floor(random(this.chambers.length))].addAid()
      this.chambers[floor(random(this.chambers.length))].addAmmo()
      this.chambers[floor(random(this.chambers.length))].addRipper(1)
    }
    this.chambers[floor(random(this.chambers.length))].addCash()
    if (!this.endchamber) {
      this.endchamber = this.chambers[0]
      this.endchamber.col = this.connections[0].lockedcol
      this.startchamber = this.chambers[1]
    }
    this.endchamber.col = this.connections[0].lockedcol
    this.endchamber.wallcol = [230, 230, 230, 255]
    this.endchamber.item = undefined
    if (!this.startchamber) {
      this.startchamber = this.chambers[1]
    }
    this.startchamber.monsters = []
    this.endchamber.monsters = []
    //Damit ist die Map (also alle Kammern, Monster und Verbindungen) initialisiert! Hurra!
    this.zoom = (width / 2) / this.sidelengths[1] / height
    this.player.goToChamber(this.startchamber)
  }

  this.update = function() {
    if (this.player.lives > 0 && !this.animation) {
      this.player.update()
      for (i = 0; i < this.player.chamber.connections.length; i++) {
        var animation = this.player.chamber.connections[i][0].check(this.player)
        if (animation) {
          this.animation = animation
          i = this.player.chamber.connections.length
        }
      }
      if (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)) {
        this.fixedview = true
      }
      if (this.zoom < (width / 2.5) / this.sidelengths[1] / height) {
        if (this.x <= width * 0.25 && mouseX <= 10) {
          this.fixedview = false
          this.x += (this.w / 100)
        } else if (this.x >= (width * 0.75) - this.w && mouseX >= width - 10) {
          this.fixedview = false
          this.x -= (this.w / 100)
        }
        if (this.y <= height * 0.25 && mouseY <= 10) {
          this.fixedview = false
          this.y += (this.w / 100)
        } else if (this.y >= (height * 0.75) - this.w && mouseY >= height - 10) {
          this.fixedview = false
          this.y -= (this.w / 100)
        }
      }
    }
  }

  this.disp = function() {
    if (this.zoom < (width / 32) / this.sidelengths[1] / height) {
      this.zoom = (width / 32) / this.sidelengths[1] / height
    } else if (this.zoom > width / this.sidelengths[1] / height) {
      this.zoom = width / this.sidelengths[1] / height
    }
    this.w = height * this.zoom
    if (this.animation === false) {
      if (this.fixedview) {
        this.x = (width / 2) - (this.player.chamber.m[0] * this.w)
        this.y = (height / 2) - (this.player.chamber.m[1] * this.w)
      }
      this.displayMap()
      this.player.disp(this.x, this.y, this.w, mouseX, mouseY)
    } else if (this.animation && this.animation[0] > 0) {
      this.x = (width / 2) - (this.player.chamber.m[0] * this.w) + (this.animation[1] * this.w * this.animation[0])
      this.y = (height / 2) - (this.player.chamber.m[1] * this.w) + (this.animation[2] * this.w * this.animation[0])
      this.displayMap()
      this.animation[0]--
    } else {
      this.animation = false
      this.displayMap()
    }
    if (keyIsDown(16) || this.player.chamber === this.endchamber || this.player.lives <= 0) {
      this.dispHub()
    }
    if (this.player.chamber === this.endchamber && keyIsDown(32)) {
      this.level++
      this.player.cash += 100
      this.player.lives = this.player.maxlives
      this.player.ammo = this.player.maxammo
      this.setup(this.level * 5)
    } else if (this.player.lives <= 0 && keyIsDown(32)) {
      this.level = 1
      this.player = new Player()
      this.setup(10)
    }
  }

  this.displayMap = function() {
    background(31, 100, 32)
    //landscape art
    fill(135, 206, 235)
    noStroke();
    ellipse(this.x - 100, this.y - 200, 1000, 400)
    ellipse(this.x + 200, this.y - 300, 1000, 400)
    fill(135, 206, 235, 100)
    ellipse(this.x - 100, this.y - 200, 1100, 500)
    ellipse(this.x + 200, this.y - 300, 1100, 500)
    fill(135 - 20, 206 - 20, 235 - 20, 100)
    ellipse(this.x - 100, this.y - 200, 800, 300)
    ellipse(this.x + 200, this.y - 300, 800, 300)

    for (i = 0; i < this.randNumArrayX.length; i++) {
        fill(31-10, 100-10, 32-10)
        ellipse(this.x + this.randNumArrayX[i], this.y + this.randNumArrayY[i], 30, 30)
        ellipse(this.x + this.randNumArrayX[i] + 20, this.y + this.randNumArrayY[i], 30, 30)
    }
    //background end

    for (i = 0; i < this.connections.length; i++) {
        this.connections[i].disp(this.x, this.y, this.w)
    }
    for (i = 0; i < this.chambers.length; i++) {
        if (this.chambers[i].visible(this.x, this.y, this.w)) {
        this.chambers[i].update(this.player)
        this.chambers[i].disp(this.x, this.y, this.w)
        }
    } 
  }    


  this.dispHub = function() {
    background(0, 0, 0, 150)
    noStroke()
    fill(255)
    textSize(25)
    textAlign(CENTER, CENTER)
    var leveltext = "Level " + this.level
    if (this.player.chamber === this.endchamber) {
      leveltext += "   -   press space for next level"
    } else if (this.player.lives <= 0) {
      leveltext += "   -   press space for restart"
    }
    text(leveltext, width / 2, height * (0.25 / 3))
    var x = (width * (1 / 3)) - 150
    var r = 300 / ((this.player.maxlives - 1) * 3)
    for (hi = 0; hi < this.player.maxlives; hi++) {
      if (hi < this.player.lives) {
        fill(255, 51, 51)
      } else {
        fill(40)
      }
      ellipse(x, height * (0.875 / 3), r * 2, r * 2)
      x += r * 3
    }
    fill(255)
    textSize(50)
    textAlign(RIGHT, CENTER)
    text(this.player.keys + " x  ", width * (2 / 3), height * (0.875 / 3))
    displayKey((width * (2 / 3)) + 50, height * (0.875 / 3), 50, [255, 255, 0, 255])
    var x = (width / 3) - 150
    var r = 300 / ((this.player.maxammo - 1) * 3)
    for (hi = 0; hi < this.player.maxammo; hi++) {
      if (hi < this.player.ammo) {
        fill(238, 201, 0)
      } else {
        fill(40)
      }
      ellipse(x, height * (1.5 / 3), r * 2, r * 2)
      x += r * 3
    }
    fill(51, 255, 51)
    textSize(50)
    textAlign(CENTER, CENTER)
    text(this.player.cash + "$ cash", width * (2 / 3), height * (1.5 / 3))
    if (this.items.length <= ceil(this.level / 2) + 3) {
      var length = this.items.length
    } else {
      var length = ceil(this.level / 2) + 3
    }
    var boxwidth = height / 5.25
    var boxheight = height * (0.625 / 3)
    var boxgab = width / 65
    var pannelwidth = (boxwidth * length) + (boxgab * (length - 1))
    var x = (width / 2) - (pannelwidth / 2)
    for (i = 0; i < length; i++) {
      noStroke()
      var unbought = true
      for (i1 = 0; i1 < this.player.guns.length; i1++) {
        if (this.items[i].name === this.player.guns[i1].name) {
          unbought = i1
        }
      }
      var y = (height * (2.25 / 3)) - (boxheight / 2)
      if (mouseX >= x && mouseY >= y && mouseX <= x + boxwidth && mouseY <= y + boxheight) {
        var within = true
      } else {
        var within = false
      }
      if (unbought === true) {
        if (within) {
          fill(40, 240, 40, 200)
        } else {
          fill(0, 200, 0, 200)
        }
      } else {
        if (within) {
          fill(210, 210, 210, 200)
        } else {
          fill(255, 255, 255, 200)
        }
      }
      rect(x, y, boxwidth, boxheight)
      this.items[i].textbox(x, y + 5, boxwidth, boxheight)
      y = (height * (2.475 / 3))
      textAlign(CENTER, CENTER)
      if (this.items[i].name === this.player.gun.name) {
        fill(0, 200, 0)
        textSize(boxheight / 15)
        text("selsected", x + (boxwidth / 2), y)
      } else if (unbought === true) {
        if (this.player.cash >= this.items[i].cost) {
          fill(0, 200, 0)
        } else {
          fill(200, 0, 0)
        }
        stroke(0)
        strokeWeight(1)
        textSize(boxheight / 8)
        text(this.items[i].cost, x + (boxwidth / 2), y)
        if (within && mouseIsPressed && this.player.cash >= this.items[i].cost) {
          this.items[i].buy(this.player)
        }
      } else {
        if (within && mouseIsPressed) {
          this.player.gun = this.player.guns[unbought]
        }
      }
      x += boxwidth + boxgab
    }
  }
}

function AidUpgrade() {
  this.name = "Aid+"
  this.lives = 1
  this.cost = 250
  this.lastbuy = -1000

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Get " + this.lives + " permament", x + 10, y)
    y += textSize() + 5
    text("extra-live", x + 10, y)
  }

  this.buy = function(player) {
    if (frameCount - this.lastbuy >= 10) {
      player.maxlives++
      player.lives = player.maxlives
      player.cash -= this.cost
      this.lastbuy = frameCount
    }
  }
}

function AmmoUpgrade() {
  this.name = "Ammo+"
  this.ammo = 8
  this.cost = 250
  this.lastbuy = -1000

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Get " + this.ammo + " permament", x + 10, y)
    y += textSize() + 5
    text("extra ammo", x + 10, y)
  }

  this.buy = function(player) {
    if (frameCount - this.lastbuy >= 10) {
      player.maxammo += this.ammo
      player.ammo = player.maxammo
      player.cash -= this.cost
      this.lastbuy = frameCount
    }
  }
}


function BuyKeys() {
  this.name = "Keys"
  this.keys = 8
  this.cost = 250
  this.lastbuy = -1000

  this.textbox = function(x, y, boxwidth, boxheight) {
    fill(200, 200, 0, 255)
    textSize(boxheight / 7)
    textAlign(LEFT, TOP)
    text(this.name, x + 10, y)
    y += textSize() + 5
    fill(0)
    textSize(boxheight / 10)
    text("Get " + this.keys + " temporary", x + 10, y)
    y += textSize() + 5
    text("keys", x + 10, y)
  }

  this.buy = function(player) {
    if (frameCount - this.lastbuy >= 10) {
    player.keys += this.keys
      player.cash -= this.cost
      this.lastbuy = frameCount
    }
  }
}
