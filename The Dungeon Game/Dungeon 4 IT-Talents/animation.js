function TextAnimation(txt) {
  this.txt = txt
  this.t = 0
  this.animation_length = 150
  this.min_size = height / 6
  this.max_size = height / 4

  this.disp = function() {
    if (this.t < this.animation_length) {
      noStroke()
      fill(25)
      textSize(map(this.t, 0, this.animation_length, this.min_size, this.max_size))
      textAlign(CENTER)
      text(this.txt, width / 2, height / 2)
    }
    this.t++
  }
}
