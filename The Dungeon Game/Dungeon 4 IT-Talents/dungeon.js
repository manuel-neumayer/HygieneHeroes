//Das dungeon.js Skript beherbergt die Dungeon() constructerfunction und damit das Herzstück des Programms,
//das die Map generiert und den Spieler, alle Kammern und Monster steuert. Darunter befindent sich die dem Spieler zur
//Verfügung stehenden Upgrades.
function Dungeon() {
  this.level = 1
  this.player = new Player()
  //Die .w Variable gibt Größe der Darstellung der Map in Pixeln an. Also die Seitenlänge der quadratischen Map. (Siehe .disp())
  this.w = height
  //Die .x und .y Variablen geben den linken, oberen Eckpunkt der Map an und damit, wie weit sie verschoben ist (Siehe .update() und .disp()).
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
    //Die .setup() function generiert ein gesamtes Level, initialisiert also die gsamte Map (Kammern und Monster) und den Spieler selbst.
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
    //wird erst in den jeweiligen functions (siehe Dungeon.disp() und Chamber.disp()) mit Hilfe der .w Variable festgelegt.
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

      }
      //Siehe Chamber()
    }
    //Das .chambers Array ist nun mit der von .numberofchambers fesgelegten Zahl an Kammern gefüllt. Es folgt
    //Schritt 2
    //In diesem Schritt werden mit folgendem for() Loop für jede Kammer die Nachbarn, aso die am nähsten stehenden Kammern,
    //mit denen eine Verbindung möglich ist, gesucht.
    for (i = 0; i < this.chambers.length; i++) {
      var chamber = this.chambers[i]
      //Die Variable chamber ist die Kammer, deren Nachbarn wir akutell suchen.
      var neighbors = [[], [], [], [], []]
      //In die Indexe [0, 1, 2, 3] des neighbors Array füllen wir alle möglichen Nachbarn, sortiert nach ihrer Position relativ zur chamber.
      //Dazu gehen wir erneut durch das gesamte .chambers Array.
      for (i1 = 0; i1 < this.chambers.length; i1++) {
        if (this.chambers[i1].i !== chamber.i) {
          //Die chamber selbst lassen wir natürlich aus. Bei alen anderen Kammer anaysieren wir wie sie im Verhätnis zur chamber steht
          //und füllen sie entsprechend ins neighbors Array ein.
          if (this.chambers[i1].intersect(chamber.x, chamber.y, chamber.width, chamber.height, -this.pathweight, false, true)) {
            //Siehe Chamber.intersect()
            if (this.chambers[i1].x - chamber.x >= 0) {
              neighbors[0].push(i1)
              //In Index 0 des neighbors Array füllen wir die möglichen Nachbarn links der chamber
            } else {
              neighbors[1].push(i1)
              //In Index 1 des neighbors Array füllen wir die möglichen Nachbanr rechts der chamber
            }
          } else if (this.chambers[i1].intersect(chamber.x, chamber.y, chamber.width, chamber.height, -this.pathweight, true)) {
            if (this.chambers[i1].y - chamber.y >= 0) {
              neighbors[2].push(i1)
              //In Index 2 des neighbors Array füllen wir die Nachbanr unterhalb der chamber
            } else {
              neighbors[3].push(i1)
              //In Index 3 des neighbors Array füllen wir die Nachbanr oberhalb der chamber
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
        //Hat die chamber rechts und oberhalb keine Nachbarn (ist also am Rand der Map), vermerken wir außerdem,
        //dass der Spieler in ihr starten sollte und legen sie als .startchamber fest.
      } else if (neighbors[0].length === 0 && neighbors[2].length === 0) {
        this.endchamber = chamber
        //Hat sie links und unterhalb keine Nachbarn, legen sie wir als .endchamber fest - also die, die der Spieler
        //später erreichen sollte.
      }
    }
    //Jeder Kammer sind jetzt also ihre Nachbarn zugewiesen. Es folgt
    //Schritt 3
    //In diesem Schritt wird entschieden, zu welcher ihrer Nachbarn die einzelen Kammern auch tatsächlich Verbindungen erhalten.
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
      //Nun ermitteln wir mit der .checkNeighbors() function (Siehe Chamber.checkNeighbors()) die Anzahl der noch nicht besuchten Nachbarn von current
      var currentneighbors = current.checkNeighbors(true)
      //Hat current nicht besuchte Nachbarn...
      if (currentneighbors > 0) {
        if (currentneighbors > 1) {
          leftchambers.push(current)
        }
        //Generieren wir eine Verbindung zu einem der unbesuchten Nachbarn (siehe Connection())
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
          //Gibt es keine vorgemerkten Kammern (also Kammern mit noch nicht besuchten Nachbarn) mehr,
          //wurden alle Kammern besucht und damit mit einer anderen Kammer verbunden - der Algorithmus ist abgeschlossen und
          //wir verlassen den while() Loop.
          settingup = false
        }
      }
    }
    //Nun haben wir ein Array (.chambers) mit zufällig platzierten Kammern, die in Form eines alle Kammern verbindenen Labyrinths miteinander verbunden sind.
    //Es folgt der letzte Schritt zur Generierung der Map:
    //Schritt 4
    //In diesem Schritt werden eine bestimmte Anzahl gesperrter Verbindungen zwischen den Kammern generiert und Items und Monster in den Kammern platziert.
    //Die Anzahl der gesperrten Verbindungen steht in direktem Verhältnis zur Anzahl an Kammern (1 / 3).
    //Sie werden in folgendem for() Loop generiert:
    for (i = 0; i < floor(this.numberofchambers / 3); i++) {
      var searching = true
      //Im folgendem while() Loop wird zuerst eine mögliche Stelle für eine der gesperrten Verbindungen gesucht.
      while (searching) {
        var index = floor(random(this.chambers.length))
        //Dazu wird zuerst der Index einer zufälligen Kammer im .chambers Array gewählt (index). Mit dem folgenden for() Loop werden dann
        //alle Nahcbarn der Kammer gewählt und überprüft, ob sie mit der ausgewählten Kammer in .chambers[index] bereits verbunden sind.
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
          //Führt keine der Verbindungen des Nachbarn zur chambers[index]-Kammer, kann von der chambers[index]-Kammer zum gerade überprüften Nachbarn
          //eine (gesperrte) Verbindung eingegangen werden.
          if (unconnected) {
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
    //Nun wird die Map mit Items und Monstern befüllt (Siehe .add functions von Chamber())
    for (i = 0; i < ceil(this.chambers.length / 15); i++) {
      this.chambers[floor(random(this.chambers.length))].addKey()
      //if (random(1 < (1 / 3))) {
      //  this.chambers[floor(random(this.chambers.length))].addAid()
      //}
      this.chambers[floor(random(this.chambers.length))].addAmmo()
    }
    for (i = 0; i < this.chambers.length; i++) {
      if (random(1) < 0.3) {
        this.chambers[i].addRipper(4)
      }
      if (random(1) < 0.5) {
        this.chambers[i].addBottle()
      } else {
        this.chambers[i].addSink()
      }
      if (this.level >= 5 && random(1) < (1 / 30)) {
        if (this.level >= 12) {
          //Manche Monster tauchen erst in späteren Leveln auf.
          this.chambers[floor(random(this.chambers.length))].addRipper(ceil(random(3)))
        } else if (this.level >= 9) {
          this.chambers[floor(random(this.chambers.length))].addRipper(ceil(random(2)))
        } else {
          this.chambers[floor(random(this.chambers.length))].addRipper(1)
        }
      }
      if (this.level >= 6 && random(1) < (1 / (this.chambers.length * 2))) {
        this.chambers[i].addCash()
      }
    }
    this.startchamber.item = undefined
    //Nun wird noch einmal überprüft, ob bereits eine .endchamber gefunden werden konnte.
    //Notfalls wird diese sonst zufällig gewählt. Außerdem werden Farben und Item der .endchamber angepasst
    //beziehungsweise entfernt. Dasselbe geschieht mit der .startchamber.
    if (!this.endchamber) {
      this.endchamber = this.chambers[0]
    }
    this.endchamber.col = this.connections[0].lockedcol
    this.endchamber.wallcol = [230, 230, 230, 255]
    this.endchamber.item = undefined
    if (!this.startchamber) {
      this.startchamber = this.chambers[1]
    }
    this.startchamber.monsters = []
    this.endchamber.monsters = []
    //Damit ist die Map (also alle Kammern, Monster und Verbindungen) initialisiert. Hurra!
    //Zum Schluss wird noch die .zoom Variable festgelegt (sie bestimmt später wie groß die Map dargestellt wird) und der Spieler
    //mit der .goToChamber() function an seinen Ausgangspunkt geschickt.
    this.zoom = (width / 2) / this.sidelengths[1] / height
    this.player.goToChamber(this.startchamber)
  }

  //Die .update() function steuert den Spieler, alle Kammern und Monster an und kümmert sich zusammen mit der .disp() function
  //um das Sichtfeld des Spielers.
  this.update = function() {
    //Sie handelt nur wenn der Spieler am Leben ist (also mindestens 1 Leben hat) und gerade keine Animation (alos ein
    //Übergang von einer Kammer zur nächsten) stattfindet.
    if (this.player.lives > 0 && !this.animation) {
      //Als erstes steuert sie den Spieler an (Siehe Player.update()), dann überprüft sie (indem sie in folgendem for () Loop
      //durch alle Verbindungen seiner aktullen Kammer (in der er sich gerade befindet) geht), ob der Spieler
      //gerade eine Verbindung zwischen zwei Kammern passieren will und stellt, wenn ja, eine Animation ein.
      this.player.update()
      for (i = 0; i < this.player.chamber.connections.length; i++) {
        var animation = this.player.chamber.connections[i][0].check(this.player)
        //Siehe Connection.check()
        if (animation) {
          this.animation = animation
          i = this.player.chamber.connections.length
        }
      }
      //Bewegt sich der Spieler (also wird eine der folgenden Tasten gedüpckt), wird sein Sichtfeld mit der .fixedview Variable
      //auf seine akutelle Kammer zentriert.
      if (keyIsDown(87) || keyIsDown(83) || keyIsDown(65) || keyIsDown(68)) {
        this.fixedview = true
      }
      //Ist das Sichtfeld etwas herausgezoomt (angeben durch die .zoom Variable)..
      if (this.zoom < (width / 2.5) / this.sidelengths[1] / height) {
        //und die Maus (mouseX) am linken Bildschirmrand und die Map (this.x) nicht zu weit nach links verschoben
        if (this.x <= width * 0.25 && mouseX <= 10) {
          this.fixedview = false
          this.x += (this.w / 100)
          //wird die Map mit der .x Variable nach links verschoben
          //Dasselbe wird für die anderen Seiten (rechts, oben, unten) überprüft.
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
    if (this.player.chamber === this.endchamber && keyIsDown(32)) {
      //Befindet sich der Spieler in der .endchamber und drückt die Leertaste, wird ein neues Level generiert (Siehe .setup()).
      this.level++
      this.player.lives = this.player.maxlives
      this.player.ammo = this.player.maxammo
      this.setup(this.level * 5)
    } else if (this.player.lives <= 0 && keyIsDown(32)) {
      //Ist er gestorben (Hat keine Leben mehr) und drückt die Leertaste, landet er in einem neu generiertem 1. Level.
      this.level = 1
      this.player = new Player()
      this.setup(10)
    }
    //Damit ist die .update() function bereits beendet!
  }

  //Die .disp() function visualisiert die Map, alle ihre Kammern und Monster und den Spieler. Sie kümmert sie auch um das Sichtfeld
  //des Spielers (siehe .update())
  this.disp = function() {
    //Als erstes überprüft sie ob zu weit hinein- oder herausgezoomt ist.
    if (this.zoom < (width / 32) / this.sidelengths[1] / height) {
      //Wenn ja, justiert sie die .zoom Variable.
      this.zoom = (width / 32) / this.sidelengths[1] / height
    } else if (this.zoom > width / this.sidelengths[1] / height) {
      this.zoom = width / this.sidelengths[1] / height
    }
    //Dann justiert sie die .w Variable anhand der .zoom Variable neu. Die .zoom Variable kann vom Spieler mit dem Mausrad
    //angesteuert werden (siehe mouseWheel())
    this.w = height * this.zoom
    //Findet gerade keine Animation statt..
    if (this.animation === false) {
      if (this.fixedview) {
        //wird das Sichtfeld, falls von der .fixedview Variable so verlangt, auf die aktuelle Spieler-Kammr zentriert.
        this.x = (width / 2) - (this.player.chamber.m[0] * this.w)
        this.y = (height / 2) - (this.player.chamber.m[1] * this.w)
      }
      //Danach wird die Map und der Spieler dargestellt.
      //Siehe .displayMap() und Player.disp()
      this.displayMap()
      this.player.disp(this.x, this.y, this.w, mouseX, mouseY)
    } else if (this.animation && this.animation[0] > 0) {
      //Findet eine Animation statt und ihr 1. Index, der die Zeit, die so noch dauert angibt, ist noch nicht null, wird
      //die .x und .y Variable dem 2. und 3. Index der .animation Variable entsprechend geändert.
      this.x = (width / 2) - (this.player.chamber.m[0] * this.w) + (this.animation[1] * this.w * this.animation[0])
      this.y = (height / 2) - (this.player.chamber.m[1] * this.w) + (this.animation[2] * this.w * this.animation[0])
      //Danach wird dich Map (durch die Veränderung der .x und .y Variable eben etwas verschoben) visualisiert und der Index 0
      //der .animation Variable (der eben die noch verbleibende Dauer der Animation angibt) um eins verringert
      this.displayMap()
      this.animation[0]--
    } else {
      //Findet eine Animation ab, ihr 1. Index beträgt aber 0, wird die Animation deaktiviert.
      this.animation = false
      this.displayMap()
    }
    //Drückt der Spieler die Shift-Taste wird das Hub dargestellt (Siehe .dispHub())
    if (keyIsDown(16) || this.player.chamber === this.endchamber || this.player.lives <= 0) {
      this.dispHub()
    }
  }

  //Die .displayMap() function visualisiert die Map (Siehe .disp())
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


    //Als erstes generiert sie einen weißen Hintergrund.
    //Dann steuert sie die .disp() functions aller Verbindungen und Kammern an (Siehe Connection.disp() und Chamber.disp())

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


  //Die .dispHub() function visualisiert das Hub.
  this.dispHub = function() {
    //Als erstes verdunkelt sie den Hintergrund
    background(0, 0, 0, 150)
    noStroke()
    fill(255)
    textSize(25)
    textAlign(CENTER, CENTER)
    //Dann gibt sie das aktuelle Level und gegebenenfalls extra Informationen an.
    var leveltext = "Level " + this.level
    if (this.player.chamber === this.endchamber) {
      leveltext += "   -   press space for next level"
    } else if (this.player.lives <= 0) {
      leveltext += "   -   press space for restart"
    }
    text(leveltext, width / 2, height * (0.25 / 3))
    //Als nächstes wird die Lebensanzeige des Hubs visualisiert
    var w = width / 4.5
    var x = (width * (1 / 3)) - (w / 2)
    var r = w / ((this.player.maxlives - 1) * 3)
    for (hi = 0; hi < this.player.maxlives; hi++) {
      if (hi < this.player.lives) {
        fill(255, 51, 51)
      } else {
        fill(40)
      }
      ellipse(x, height * (0.875 / 3), r * 2, r * 2)
      x += r * 3
    }
    //Daneben wird die Anzahl an Schlüsseln, die der Spieler zum aktivieren gesperrter Verbindungen besitzt, angezeigt
    fill(255)
    textSize(height / 15)
    textAlign(RIGHT, CENTER)
    text(this.player.keys + " x  ", width * (2 / 3), height * (0.875 / 3))
    displayKey((width * (2 / 3)) + 50, height * (0.875 / 3), height / 15, [255, 255, 0, 255])
    //Siehe displayKey()
    //Danach wir nach gleichem Prinzip wie bei den Leben der Munitionsvorrat des Spielers visualisiert
    var w = width / 4.5
    var x = (width * (1 / 3)) - (w / 2)
    var r = w / ((this.player.maxammo - 1) * 3)
    for (hi = 0; hi < this.player.maxammo; hi++) {
      if (hi < this.player.ammo) {
        fill(238, 201, 0)
      } else {
        fill(40)
      }
      ellipse(x, height * (1.5 / 3), r * 2, r * 2)
      x += r * 3
    }
    //Danneben wird sein Guthaben an Cash (Der "Währung" des Spiels) angezeigt
    fill(51, 255, 51)
    textSize(height / 15)
    textAlign(CENTER, CENTER)
    text(this.player.cash + "$ cash", width * (2 / 3), height * (1.5 / 3))
    //Darunter visualisiert die .dispHub() function alle zum Kauf verfügbaren oder bereits erworbenen Waffen und Upgrades
    if (this.items.length <= ceil(this.level / 2) + 3) {
      var length = this.items.length
    } else {
      var length = ceil(this.level / 2) + 3
    }
    //Wie viele der Items angezeigt werden hängt vom aktuellen Level an (manche Items kann man erst in späteren LEveln kaufen)
    //und wird durch die length Variable festgelegt.
    var boxwidth = height / 5.25
    var boxheight = height * (0.625 / 3)
    var boxgab = width / 65
    var pannelwidth = (boxwidth * length) + (boxgab * (length - 1))
    //Danach werden die Maße der Boxen, in denen die Items angezeigt werden, und die Größe des gesamten Pannels (also der
    //Breite aller Boxen zusammengerechnet) festgelegt.
    var x = (width / 2) - (pannelwidth / 2)
    //Die x Variable gibt in initialisierter Form die x-Position der linkesten Box an. Wir brauchen sie im folgendem for () Loop:
    for (i = 0; i < length; i++) {
      var y = (height * (2.25 / 3)) - (boxheight / 2)
      noStroke()
      var unbought = true
      for (i1 = 0; i1 < this.player.guns.length; i1++) {
        if (this.items[i].name === this.player.guns[i1].name) {
          unbought = i1
        }
      }
      //Nachdem bestimmt wurde, ob das aktuelle Item bereits vom Spieler erworben wurde und die y Variable fesgelegt ist, wird
      //überprüft ob sich der Mauszeiger gerade über der aktuellen Box befindet und in der within Variable gespeichert.
      if (mouseX >= x && mouseY >= y && mouseX <= x + boxwidth && mouseY <= y + boxheight) {
        var within = true
      } else {
        var within = false
      }
      //Jenachdem ob das Item bereits gekauft wurde und sich die Maus darüber befindet wird die Boxfarbe mit hell/dunkel grün oder
      //hell/dunkel weiß fesgelegt
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
      //und die Box gezeichnet.
      rect(x, y, boxwidth, boxheight)
      //In der Box wird das Datenblatt des Items mit der .textbox() function (Siehe Objekte im .items Array() (Siehe .setup())) gezeichnet.
      this.items[i].textbox(x, y + 5, boxwidth, boxheight)
      y = (height * (2.475 / 3))
      textAlign(CENTER, CENTER)
      if (this.items[i].name === this.player.gun.name) {
        //Ist die aktuelle Waffe des Spielers das Item der gerade visualisierten Box, wird diese mit "selsected" gekennzeichnet.
        fill(0, 200, 0)
        textSize(boxheight / 15)
        text("selsected", x + (boxwidth / 2), y)
      } else if (unbought === true) {
        //Wurde das Item noch nicht gekauft wird sie mit dem Preis des Items in je nachdem Cash Guthaben des Spielers
        //grüner oder roter Farbe versehen.
        if (this.player.cash >= this.items[i].cost) {
          fill(0, 200, 0)
        } else {
          fill(200, 0, 0)
        }
        stroke(0)
        strokeWeight(1)
        textSize(boxheight / 8)
        text(this.items[i].cost, x + (boxwidth / 2), y)
        if (this.items[i].notdruing && this.player.chamber !== this.endchamber) {
          //Sollte ein Item nur in der .endchamber erwerblich sein und der Spieler sich nicht in dieser befinden, wird auch das angemerkt.
          y += textSize() * (2.5 / 3)
          fill(255)
          noStroke()
          textSize(boxheight / 17.5)
          text("only at endchamber avaible", x + (boxwidth / 2), y)
        } else {
          if (within && mouseIsPressed && this.player.cash >= this.items[i].cost && this.player.lives > 0) {
            //Befindet sich der Spieler in der richtigen Kammer, hat genügend Geld und klickt gerade auf das Item, wird die .buy()
            //function des Items aufgerufen (Siehe Objekte im .items Array() (Siehe .setup())).
            this.items[i].buy(this.player)
          }
        }
      } else {
        if (within && mouseIsPressed) {
          //Wurde das Item als Waffe bereits gekaufft und der Spieler klickt auf die Box, wird das sich im .guns Array des Spielers (Siehe Player())
          //Äquivalent zum akutellen Item als seine Waffe eingestellt (der Index diesens wurde in der unbought Variable gespeichert).
          this.player.gun = this.player.guns[unbought]
        }
      }
      //Zu guter letzt wird die x Variable um die Breite der aktuellen Box und den Abstand zwischen zwei Boxen erhöht und somit
      //auf die nächste Box vorbereitet.
      x += boxwidth + boxgab
    }
  }
}


//Die folgenden constructerfunction sind Upgrades, die der Spieler im Hub erwerben kann und die im .items Array des Dungeons gespeichert sind.
//Jedes funktioniert ungefähr so:
function AidUpgrade() {
  this.name = "Aid+"
  this.lives = 1
  this.cost = 300
  this.lastbuy = -1000
  this.notdruing = true

  //Die .textbox() function visualisiert die wichtigsten Fakten zum Upgrade bei der .dispHub() function des Dungeons.
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

  //Die .buy() function führt die erforderlichen Aktionen aus, sollte der Spieler das Upgrade im Hub erwerben (Siehe Dungeon.dispHub())
  this.buy = function(player) {
    //Damit der Spieler nicht versehentlich durch zu langes Drücken der Maustaste ungewollt mehrere Upgrades kaufft,
    //wird gespeichert, wann er dieses zum letzten Mal gekauft und überprüft ob dieser Kauf zumindest 10 Frames her ist.
    if (frameCount - this.lastbuy >= 10) {
      //Dann wird die jeweilige Aktion des Items ausgeführt. In dieser constructerfunction das Erhöhen der Maximalleben des Spielers.
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
  this.cost = 300
  this.lastbuy = -1000
  this.notdruing = true

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
  this.keys = 5
  this.cost = 300
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
