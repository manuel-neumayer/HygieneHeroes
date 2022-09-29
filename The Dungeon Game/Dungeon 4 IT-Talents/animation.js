function Animation(txt) {
  this.txt = txt
  this.t = 0
  this.animation_length = 150

  this.disp = function() {
    if (this.t < this.animation_length) {
      stroke(255, 255, 0)
      textAlign(CENTER)
      text(this.txt, width / 2, height / 2)
    }
    this.t++
  }
}
