var elements = []
var objects = []

function newButton(cname) {
  var newButton = new Button(0, 0, cname)
  elements.push(newButton)
}

function newSlider(up1, to1, staart, Xlength) {
  var newSlider = new Slider(0, 0, up1, to1, staart, Xlength)
  elements.push(newSlider)
}

function newConsole() {
  var newConsole = new Canvas(100, 100, 100, 100, true, true, true)
  newConsole.console()
  elements.push(newConsole)
}

function disp() {
  var x = 10
  for (i = 0; i < elements.length; i++) {
    if (typeof(elements[i].Xlength) !== "undefined") {
      x += 10
      elements[i].x = x
      elements[i].y = height - 20
      elements[i].update()
      elements[i].disp()
      x += elements[i].width + 10 + 10
    } else if (elements[i].clicked !== "undefined") {
      elements[i].x = x
      elements[i].y = height - 30
      elements[i].update()
      elements[i].disp()
      x += elements[i].width + 10
    } else {
      elements[i].update()
      elements[i].disp()
    }
  }
}

function lowestOfArray(loarray) {
  var loindex = 0
  for (loi = 0; loi < loarray.length; loi++) {
    if (loarray[loi] < loarray[loindex]) {
      loindex = loi
    }
  }
  return loindex
}

function highestOfArray(hoarray) {
  var hoindex = 0
  for (hoi = 0; hoi < hoarray.length; hoi++) {
    if (hoarray[hoi] > hoarray[hoindex]) {
      hoindex = hoi
    }
  }
  return hoindex
}

function roundNumber(rnnumber, rndigits) {
  var rnroundedNumber = rnnumber * pow(10, rndigits)
  var rnroundedNumber = round(rnroundedNumber) / pow(10, rndigits)
  return rnroundedNumber
}
