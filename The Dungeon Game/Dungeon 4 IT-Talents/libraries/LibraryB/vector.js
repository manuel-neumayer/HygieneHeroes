function multVector(vecta, vectb) {
  var vecA = vecta
  var vecB = vectb
  if (vecA.z !== 0 && vecB.z !== 0) {
    var newNmb = (vecA.x * vecB.x) + (vecA.y * vecB.y) + (vecA.z * vecB.z)
    return newNmb
  } else {
    var newNmb = (vecA.x * vecB.x) + (vecA.y * vecB.y)
    return newNmb
  }
}

function acosVector(vecta, vectb) {
  var vecA = vecta
  var vecB = vectb
  if (vecA.z !== 0 || vecB.z !== 0) {
    var rad = ((vecA.x * vecB.x) + (vecA.y * vecB.y) + (vecA.z * vecB.z)) / (sqrt(sq(vecA.x) + sq(vecA.y) + sq(vecA.z)) * sqrt(sq(vecB.x) + sq(vecB.y) + sq(vecB.z)))
    var newNmb = map(acos(map(rad, -0.01, 0.01, -1, 1)), 0, PI, 0, 180)
    return newNmb
  } else {
    var rad = ((vecA.x * vecB.x) + (vecA.y * vecB.y)) / (sqrt(sq(vecA.x) + sq(vecA.y)) * (sq(vecB.x) + sq(vecB.y)))
    var newNmb = map(acos(map(rad, -0.01, 0.01, -1, 1)), 0, PI, 0, 180)
    return newNmb
  }
}

function degreeVector(vecta) {
  var vecA = vecta
  var vecAabs = sqrt(sq(vecA.x) + sq(vecA.y) + sq(vecA.z))
  if (vecA.z !== 0) {

  } else {
    if (vecA.y <= 0) {
      var newNmbA = map(asin(vecA.x / vecAabs), PI / 2, -PI / 2, 0, 180)
    } else {
      var newNmbA = map(asin(vecA.x / vecAabs), -PI / 2, PI / 2, 180, 360)
    }
    return newNmbA
  }
}

function turnVector(vect, degreenumb) {
  var vecA = vect
  var vecabs = sqrt(sq(vecA.x) + sq(vecA.y) + sq(vecA.z))
  var degree1 = degreenumb
  if (vecA.z === 0) {
    var degree0 = degreeVector(vecA)
    if (degree0 + degree1 <= 180 && degree0 + degree1 >= 0) {
      var newNmbx = vecabs * cos(map(degree0 + degree1, 0, 360, 0, TWO_PI))
      var newNmby = vecabs * sin(map(degree0 + degree1, 0, 360, 0, TWO_PI))
      var newNmb = createVector(newNmbx, -newNmby)
    } else {
      var newNmbx = vecabs * cos(map(degree0 + degree1, 0, 360, 0, TWO_PI))
      var newNmby = vecabs * sin(map(degree0 + degree1, 0, 360, 0, TWO_PI))
      var newNmb = createVector(newNmbx, -newNmby)
    }
    return newNmb
  }
}

function normalVector(vect, diir) {
  var vecA = vect
  if (diir === 1) {
    var newNmb = createVector(-vecA.y, vecA.x)
  } else {
    var newNmb = createVector(vecA.y, -vecA.x)
  }
  return newNmb
}

function returnVector(vecta, vectb) {
  var entryVec = vecta
  var wallVec = vectb
  var angle0 = acosVector(entryVec, wallVec)
  if ((entryVec.x >= 0 && entryVec.y >= 0) || (entryVec.x >= 0 && entryVec.y <= 0)) {
    var leavingVec = turnVector(entryVec, 180 + (2 * angle0))
  }
  if (entryVec.x >= 0 && entryVec.y >= 0) {
    var leavingVec = turnVector(entryVec, 180 + (2 * angle0))
  }
}

function crossOfVector(pos1, vec1, pos2, vec2) {
  if (vec1.x === 0) {
    vec1.x += 0.0001
  }
  var ratio = -(vec1.y / vec1.x)
  var term11 = (pos1.x * ratio) + pos1.y
  var term12 = (pos2.x * ratio) + pos2.y
  var term13 = (vec2.x * ratio) + vec2.y
  var ct = (term11 - term12) / term13
  var cx = pos2.x + (ct * vec2.x)
  var cy = pos2.y + (ct * vec2.y)
  return createVector(cx, cy)
}
