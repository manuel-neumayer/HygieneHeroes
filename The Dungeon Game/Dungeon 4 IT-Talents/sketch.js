//Das sketch.js Skript steuert den Dungeon an und kümmert sich um ein paar externe Funktionen
//wie den Bilschirmmodus, das Pausieren des Spiels und die Spielhilfe.
var dungeon, buttons
var pause = false
var help = false
var animations
let img;


function setup() {
  createCanvas(windowWidth, windowHeight)
  dungeon = new Dungeon()
  dungeon.setup(10)
  buttons = new Buttons()
  animations = []
}

//Die windowResized() function sorgt dafür, dass der Canvas immer der aktuellen Fenstergräße des Browsers angepasst wird.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//In der draw() function werden der Dungeon und die 3 Buttons links unten am Bilschirm angesteuert.
function draw() {
  if (!pause) {
    dungeon.update()
    dungeon.disp()
    if (help) {
      this.buttons.dispHelp()
    }
    for (i = 0; i < animations.length; i++) {
      animations[i].disp()
    }
  }
  buttons.disp()
}

//Mit dem Mausrad kann der Spieler in die Map hinein- und herauszoomen - dies wird in der mouseWheel() function initiaisiert
//indem direkt auf die .zoom Variable des Dungeon zugegriffen wird.
function mouseWheel(event) {
  if (!pause) {
    dungeon.zoom -= (event.delta / 10000)
    //Die Variable .fixedview des Dungeons garantiert das das Sichtfeld des Spielers auf die
    //aktuelle Kammer der Spielfigur zentriert ist.
    dungeon.fixedview = true
  }
}

//Die mousePressed() function wird immer aufgerufen, klickt der Spieler eine Maustaste.
function mousePressed() {
  //Jenachdem wo sich der Mauszeiger gerade befindet wird dann die Aktion eines Buttons ausgeführt, also entwer
  if (buttons.within1(mouseX, mouseY)) {
    if (!pause) {
      //der Bildschirmmodus gewechselt
      fullscreen(!fullscreen())
    }
  } else if (buttons.within2(mouseX, mouseY)) {
    if (!pause) {
      //der Hilebildschirm aufgerufen oder geschlossen
      help = !help
    }
  } else if (buttons.within3(mouseX, mouseY)) {
    //das Spiel pausiert oder fortgesetzt
    pause = !pause
  } else if (!pause && !keyIsDown(16)) {
    //oder, hat der Spieler gerade nicht das Hub offen (also die Shift-Taste gedrückt), geschossen
    dungeon.player.shoot()
  }
}

//Die Buttons() constructerfunction steuert die Buttons am linken unteren Bildschirmrand
function Buttons() {
  //Die .within() functions (1 bis 3) überprüfen ob sich die eingegebenen x, y Koordinaten über dem jeweiligen Button befinden (Siehe mousePressed()).
  this.within1 = function(x, y) {
    if (x >= this.x1 - (this.factor1 / 6) && y >= this.y1 - (this.factor1 / 6) && x <= this.x1 - (this.factor1 / 6) + (this.factor1 * (8 / 6)) && y <= this.y1 - (this.factor1 / 6) + (this.factor1 * (8 / 6))) {
      return true
    } else {
      return false
    }
  }

  this.within2 = function(x, y) {
    if (x >= this.x2 - (this.factor2 / 6) && y >= this.y2 - (this.factor2 / 6) && x <= this.x2 - (this.factor2 / 6) + (this.factor2 * (8 / 6)) && y <= this.y2 - (this.factor2 / 6) + (this.factor2 * (8 / 6))) {
      return true
    } else {
      return false
    }
  }

  this.within3 = function(x, y) {
    if (x >= this.x3 - (this.factor3 / 6) && y >= this.y3 - (this.factor3 / 6) && x <= this.x3 - (this.factor3 / 6) + (this.factor3 * (8 / 6)) && y <= this.y3 - (this.factor3 / 6) + (this.factor3 * (8 / 6))) {
      return true
    } else {
      return false
    }
  }

  //Die .disp() function visualisiert die Button
  this.disp = function() {
    noStroke()
    if (!pause) {
      if (this.within1(mouseX, mouseY)) {
        this.factor1 = 35
      } else {
        this.factor1 = 30
      }
      this.x1 = this.factor1 / 2
      this.y1 = height - (this.factor1 * 1.5)
      fill(220)
      rect(this.x1 - (this.factor1 / 6), this.y1 - (this.factor1 / 6), this.factor1 * (8 / 6), this.factor1 * (8 / 6), this.factor1 / 5)
      fill(255)
      if (fullscreen()) {
        rect(this.x1, this.y1 + (0.2 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1, this.y1 + (0.6 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1 + (0.2 * this.factor1), this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
        rect(this.x1 + (0.6 * this.factor1), this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
        rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.2 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.6 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1 + (0.2 * this.factor1), this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
        rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
      } else {
        rect(this.x1, this.y1, 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1, this.y1 + (0.8 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1, this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
        rect(this.x1 + (0.8 * this.factor1), this.y1, 0.2 * this.factor1, 0.4 * this.factor1)
        rect(this.x1 + (0.6 * this.factor1), this.y1, 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1 + (0.6 * this.factor1), this.y1 + (0.8 * this.factor1), 0.4 * this.factor1, 0.2 * this.factor1)
        rect(this.x1, this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
        rect(this.x1 + (0.8 * this.factor1), this.y1 + (0.6 * this.factor1), 0.2 * this.factor1, 0.4 * this.factor1)
      }
      if (this.within2(mouseX, mouseY)) {
        this.factor2 = 35
      } else {
        this.factor2 = 30
      }
      this.x2 = this.x1 - (this.factor1 / 6) + (this.factor1 * (8 / 6)) + (this.factor2 / 2)
      this.y2 = height - (this.factor2 * 1.5)
      fill(220)
      rect(this.x2 - (this.factor2 / 6), this.y2 - (this.factor2 / 6), this.factor2 * (8 / 6), this.factor2 * (8 / 6), this.factor2 / 5)
      fill(255)
      textSize(this.factor2 * 0.85)
      textAlign(CENTER, CENTER)
      if (!help) {
        text("?", this.x2 - (this.factor2 / 6) + (this.factor2 * (4 / 6)), this.y2 - (this.factor2 / 6) + (this.factor2 * (4 / 6)))
      } else {
        text("!", this.x2 - (this.factor2 / 6) + (this.factor2 * (4 / 6)), this.y2 - (this.factor2 / 6) + (this.factor2 * (4 / 6)))
      }
    } else {
      if (pause) {
        fill(255)
        rect(this.x3 - (this.factor3 / 6), this.y3 - (this.factor3 / 6), this.factor3 * (8 / 6), this.factor3 * (8 / 6), this.factor3 / 5)
      }
    }
    if (this.within3(mouseX, mouseY)) {
      this.factor3 = 35
    } else {
      this.factor3 = 30
    }
    this.x3 = this.x2 - (this.factor2 / 6) + (this.factor2 * (8 / 6)) + (this.factor3 / 2)
    this.y3 = height - (this.factor3 * 1.5)
    fill(220)
    rect(this.x3 - (this.factor3 / 6), this.y3 - (this.factor3 / 6), this.factor3 * (8 / 6), this.factor3 * (8 / 6), this.factor3 / 5)
    fill(255)
    if (!pause) {
      rect(this.x3 + (0.2 * this.factor3), this.y3 + (0.2 * this.factor3), this.factor3 * 0.2, this.factor3 * 0.6)
      rect(this.x3 + (0.6 * this.factor3), this.y3 + (0.2 * this.factor3), this.factor3 * 0.2, this.factor3 * 0.6)
    } else {
      beginShape()
      vertex(this.x3 + (0.2 * this.factor3), this.y3 + (0.2 * this.factor3));
      vertex(this.x3 + (0.8 * this.factor3), this.y3 + (0.5 * this.factor3));
      vertex(this.x3 + (0.2 * this.factor3), this.y3 + (0.8 * this.factor3));
      endShape(CLOSE)
    }
  }

  //Die .dispHelp() function visualisiert den Hilfescreen.
  this.dispHelp = function() {
    background(0, 0, 0, 150)
    fill(255)
    noStroke()
    textSize(height / 25)
    textAlign(CENTER, CENTER)
    text("Short How To – A Dungeon Game", width / 2, textSize())
    textSize(textSize() * (2 / 3))
    text("W, A, S und D Tasten .......... Steuerung", width / 2,  height * (0.4 / 3))
    text("Shift-Taste .......... Hub", width / 2,  height * (0.6 / 3))
    text("Mauszeiger und -Taste .......... Schießen", width / 2,  height * (0.8 / 3))
    textAlign(CENTER, TOP)
    text("You are trapped in a huge dungeon and trying to escape. The only way to escape is marked on the map as a golden chamber. You can move your (blue) character across the map with the W, A, S, and D keys. You can use the scroll wheel on your mouse to zoom in and out on the map. If you have zoomed out a little, you can also move the field of view on the map by moving the mouse left, right, up or down to the edge of the screen. You can get from one chamber to the next via the gray connections between the chambers. In order to pass a connection, you simply have to drive to the point where the connection enters the chamber. Then you automatically transfer to the next chamber. However, there are also blocked, gold-marked connections that you can only pass with a key. On the way through the dungeon you will encounter many monsters that can damage you in different ways. You can defend yourself against them with your weapon by aiming at them with the mouse cursor and then pressing the left mouse button. Depending on how many lives they have, they die after a few hits. For every hit and kill of a monster you get cash, which you can later use to buy new weapons. However, you need ammo for each shot. You can replenish your ammunition supply with the help of some items on the map. Several items appear on the map: Keys, which you can use to unlock and pass through blocked connections between chambers, Medipacks, which refill your lives, and Ammo Supplies, which you can use to refill your ammo. You interact with the items by simply walking over them. Open the hub by holding down the Shift key. Here you can see your current number of lives, your weapon's ammo level, how many keys you have and how much cash you have. You can also buy new weapons and upgrades for cash in the hub. There is an upgrade to increase the maximum number of hearts, one that increases your maximum ammo supply, and an upgrade to purchase keys. Right next to the upgrades are the weapons that you already own (white) and that you can still purchase (green). Click to switch between purchased weapons and buy new ones. If you reach the golden chamber, press the spacebar to go to the next level. As you level up, dungeons become larger and guarded by trickier monsters. Much luck!"
        , textSize(), height / 3, width - (textSize() * 2), height);
  }
}
