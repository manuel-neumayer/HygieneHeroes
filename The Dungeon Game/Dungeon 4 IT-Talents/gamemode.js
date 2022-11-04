function GameMode(player) {
    this.mode = "free"
    this.player = player
    this.posessed

    this.update = function(x, y, w) {
        if (this.mode == "posessing") {
            //this.player.pointingAt = [(mouseX - x) / w, (mouseY - y) / w]
            this.posessed.pointingAt = [(mouseX - x) / w, (mouseY - y) / w]
            /*var vec1 = createVector(mouseX - (x + (this.player.x * w)), mouseY - (y + (this.player.y * w)))
            this.posessed.rotation = map(degreeVector(vec1), 360, 0, 0, TWO_PI) + PI/2
            console.log(this.posessed.rotation)*/
            //xy = this.posessionPos()
            this.player.x = this.posessed.x
            this.player.y = this.posessed.y
            this.move(this.posessed, this.posessed.walkingspeed, false)
            if (keyIsDown(32)) {
                this.posessed.posessed = false
                this.posessed = null
                this.player.posessing = false
                this.mode = "free"
                this.move(this.player, 0.03)
            }
        } else {
            this.move(this.player, this.player.walkingspeed, false)
            humans = this.player.chamber.monsters
            for (i = 0; i < humans.length; i++) {
                if (humans[i].index == "human" && humans[i].within(this.player.x, this.player.y, this.player.r)) {
                    this.setUpPosession(humans[i])
                    i = humans.length
                }
            }
        }
    }

    this.setUpPosession = function(posessed) {
        this.mode = "posessing"
        this.posessed = posessed
        this.posessed.posessed = true
        this.player.posessing = true
        var vec = createVector(this.player.x - this.posessed.x, this.player.y - this.posessed.y)
        this.rotationOffset = map(degreeVector(vec), 360, 0, 0, TWO_PI) + PI/2 - this.posessed.rotation
    }

    /*this.posessionPos = function() {
        var vec = createVector(this.player.x - this.posessed.x, this.player.y - this.posessed.y)
        vec.rotate(this.posessed.rotation + this.rotationOffset)
        return [this.posessed.x + vec.x, this.posessed.y + vec.y]
    }*/

    this.move = function(character, walkingspeed, force) {
        // if force is true, we force the character to either stand still or walk at exactly the speed walkingspeed
        yC = 0
        xC = 0
        if (keyIsDown(87)) {
            yC -= walkingspeed
        }
        if (keyIsDown(83)) {
            yC += walkingspeed
        }
        if (keyIsDown(65)) {
            xC -= walkingspeed
        }
        if (keyIsDown(68)) {
            xC += walkingspeed
        }
        if (force == true && (xC != 0 || yC != 0)) {
            l = sqrt(xC*xC + yC*yC)
            xC = xC / l
            yC = yC / l
        }
        character.x += xC
        character.y += yC
        //Wird die Taste W, A, S ode D gedrückt, bewegt sich der Spieler nach oben, links, unten oder rechts.
        if (character.x < character.chamber.x) {
          character.x = character.chamber.x
        } else if (character.x > character.chamber.x + character.chamber.width) {
          character.x = character.chamber.x + character.chamber.width
        }
        //Verlässt er die Kammer entlang der X-Achse, wird die .x Variabel des Spielers auf einen an die Kammer grenzenden Wert
        //zurückgesetzt. Dasselbe gilt für die Y-Achse:
        if (character.y < character.chamber.y) {
          character.y = character.chamber.y
        } else if (character.y > character.chamber.y + character.chamber.height) {
          character.y = character.chamber.y + character.chamber.height
        }
      }
}