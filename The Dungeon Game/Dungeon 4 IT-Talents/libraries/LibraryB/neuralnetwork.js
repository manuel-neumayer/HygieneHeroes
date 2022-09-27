function NeuralNetwork() {
  //this.settings == [layer1numberofNeurons, layer2numberofNeurons, layer3numberofNeurons]
  //this.neurons == [layer1[neuron1, neuron2], layer2[neuron1, neuron2, neuron3], layer3[neuron1, neuron2]]
  //this.synapses == [layer1[neuron1[synapse1, synapse2, synapse3], neuron2[synapse1, synapse2, synapse3]], layer2[neuron1[synapse1, synapse2], neuron2[synapse1, synapse2], neuron3[synapse1, synapse2]], layer3[neuron1, neuron2]]
  this.settings = []
  this.input = []
  this.activationfunction = 1
  this.outputfunction = 1
  this.output = []
  this.neurons = []
  this.synapses = []
  this.display = true
  //this.r = 10
  this.r = 10
  this.x = 155 + this.r
  this.y = 35

  this.generateNN = function(varsettings) {
    this.settings = varsettings
    this.input = []
    this.neurons = []
    this.synapses = []
    for (i1 = 0; i1 < this.settings[0]; i1++) {
      this.input.push(0)
    }
    for (i1 = 0; i1 < this.settings.length; i1++) {
      this.neurons.push([])
      if (i1 < this.settings.length - 1) {
        this.synapses.push([])
      }
      for (i2 = 0; i2 < this.settings[i1]; i2++) {
        if (i1 === 0) {
          var newNeuron = new InputNeuron(i1, i2)
          this.neurons[i1].push(newNeuron)
          this.synapses[i1].push([])
          for (i3 = 0; i3 < this.settings[i1 + 1]; i3++) {
            var newSynapseWeight = random(-2, 2)
            var newSynapse = new Synapse(i1, i2, i1 + 1, i3, newSynapseWeight)
            this.synapses[i1][i2].push(newSynapse)
          }
        } else if (i1 < this.settings.length - 1) {
          var newNeuronBios = random(-5, 5)
          var newNeuron = new Neuron(i1, i2, newNeuronBios)
          this.neurons[i1].push(newNeuron)
          this.synapses[i1].push([])
          for (i3 = 0; i3 < this.settings[i1 + 1]; i3++) {
            var newSynapseWeight = random(-2, 2)
            var newSynapse = new Synapse(i1, i2, i1 + 1, i3, newSynapseWeight)
            this.synapses[i1][i2].push(newSynapse)
          }
        } else {
          var newNeuronBios = random(-5, 5)
          var newNeuron = new OutputNeuron(i1, i2, newNeuronBios)
          this.neurons[i1].push(newNeuron)
        }
      }
    }
  }

  this.update = function() {
    for (i1 = 0; i1 < this.neurons.length; i1++) {
      for (i2 = 0; i2 < this.neurons[i1].length; i2++) {
        if (i1 === 0) {
          this.neurons[i1][i2].calculate(this.input)
        } else if (i1 < this.neurons.length - 1) {
          this.neurons[i1][i2].calculate(this.synapses, this.activationfunction)
        } else {
          this.neurons[i1][i2].calculate(this.synapses, this.outputfunction)
        }
        if (i1 < this.neurons.length - 1) {
          for (i3 = 0; i3 < this.synapses[i1][i2].length; i3++) {
            this.synapses[i1][i2][i3].calculate(this.neurons)
          }
        }
      }
    }
    var output = []
    for (i1 = 0; i1 < this.neurons[this.neurons.length - 1].length; i1++) {
      output.push(this.neurons[this.neurons.length - 1][i1].value)
    }
    this.output = output
  }

  this.disp = function() {
    stroke(255)
    strokeWeight(1)
    csole.consoleclear()
    for (i1 = 0; i1 < this.synapses.length; i1++) {
      for (i2 = 0; i2 < this.synapses[i1].length; i2++) {
        for (i3 = 0; i3 < this.synapses[i1][i2].length; i3++) {
          if (this.display) {
            if (this.synapses[i1][i2][i3].weight > 0) {
              if (this.neurons[i1][i2].value > 0) {
                stroke(0, map(this.neurons[i1][i2].value, 0, 1, 0, 255), 0)
              } else {
                stroke(map(this.neurons[i1][i2].value, 0, 1, 0, 255), 0, 0)
              }
            } else {
              if (this.neurons[i1][i2].value > 0) {
                stroke(map(this.neurons[i1][i2].value, 0, 1, 0, 255), 0, 0)
              } else {
                stroke(0, map(this.neurons[i1][i2].value, 0, 1, 0, 255), 0)
              }
            }
          }
          strokeWeight(abs(this.synapses[i1][i2][i3].weight))
          line(this.x + (i1 * this.r * 6), this.y + (i2 * this.r * 6), this.x + ((i1 + 1) * this.r * 6), this.y + (i3 * this.r * 6))
          csole.consolelog("synapse " + i1 + " - " + i2 + " - " + i3 + " weight: " + this.synapses[i1][i2][i3].weight + " - turns into: " + this.synapses[i1][i2][i3].value)
        }
      }
    }
    textSize(this.r * 0.95)
    textAlign(CENTER, CENTER)
    noStroke()
    for (i1 = 0; i1 < this.neurons.length; i1++) {
      for (i2 = 0; i2 < this.neurons[i1].length; i2++) {
        fill(this.neurons[i1][i2].col[0], this.neurons[i1][i2].col[1], this.neurons[i1][i2].col[2], this.neurons[i1][i2].col[3])
        ellipse(this.x + (i1 * this.r * 6), this.y + (i2 * this.r * 6), this.r * 2, this.r * 2)
        fill(0)
        text(round(this.neurons[i1][i2].value), this.x + (i1 * this.r * 6), this.y + (i2 * this.r * 6))
        csole.consolelog("neuron " + i1 + " - " + i2 + " bios: " + this.neurons[i1][i2].bios + " - turns into: " + this.neurons[i1][i2].value)
      }
    }
  }

  this.generatecode = function() {
    //this.neurons == [layer0[neuron1, neuron2], layer1[neuron1, neuron2, neuron3], layer2[neuron1, neuron2]]
    //this.synapses == [layer0[neuron0[synapse1, synapse2, synapse3], neuron1[synapse0, synapse1, synapse2]], layer1[neuron0[synapse1, synapse2], neuron1[synapse0, synapse1], neuron2[synapse0, synapse1]]]
    //this.code == [layer0[InputNeuron0[neuron0bios, synapse1weight, synapse2weight], InputNeuron1[neuron1bios, synapse1weight, synapse2weight]], layer1[neuron0[neuron0bios, synapse1weight, synapse2weight], neuron1[neuron1bios, synapse1weight, synapse2weight]], [outputNeuron1bios, outputNeuron2bios] [activationfunction, outputfunction]]
    var newCode = []
    for(i1 = 0; i1 < this.synapses.length; i1++) {
      newCode.push([])
      for (i2 = 0; i2 < this.synapses[i1].length; i2++) {
        newCode[i1].push([])
        newCode[i1][i2].push(this.neurons[i1][i2].bios)
        for (i3 = 0; i3 < this.synapses[i1][i2].length; i3++) {
          newCode[i1][i2].push(this.synapses[i1][i2][i3].weight)
        }
      }
    }
    newCode.push([])
    for (i1 = 0; i1 < this.neurons[this.neurons.length - 1].length; i1++) {
      newCode[newCode.length - 1].push(this.neurons[this.neurons.length - 1][i1].bios)
    }
    newCode.push([])
    newCode[newCode.length - 1].push(this.activationfunction)
    newCode[newCode.length - 1].push(this.outputfunction)
    return newCode
  }

  this.generatecodeText = function() {
    //this.neurons == [layer0[neuron1, neuron2], layer1[neuron1, neuron2, neuron3], layer2[neuron1, neuron2]]
    //this.synapses == [layer0[neuron0[synapse1, synapse2, synapse3], neuron1[synapse0, synapse1, synapse2]], layer1[neuron0[synapse1, synapse2], neuron1[synapse0, synapse1], neuron2[synapse0, synapse1]]]
    //this.code == [layer0[InputNeuron0[neuron0bios, synapse1weight, synapse2weight], InputNeuron1[neuron1bios, synapse1weight, synapse2weight]], layer1[neuron0[neuron0bios, synapse1weight, synapse2weight], neuron1[neuron1bios, synapse1weight, synapse2weight]], [outputNeuron1bios, outputNeuron2bios] [activationfunction, outputfunction]]
    var newText = "["
    for(i1 = 0; i1 < this.synapses.length; i1++) {
      newText += "["
      for (i2 = 0; i2 < this.synapses[i1].length; i2++) {
        newText += "["
        newText += (this.neurons[i1][i2].bios) + ", "
        for (i3 = 0; i3 < this.synapses[i1][i2].length; i3++) {
          newText += (this.synapses[i1][i2][i3].weight)
          if (i3 < this.synapses[i1][i2].length - 1) {
            newText += ", "
          }
        }
        newText += "]"
        if (i2 < this.synapses[i1].length - 1) {
          newText += ", "
        }
      }
      newText += "]"
      if (i1 < this.synapses.length - 1) {
        newText += ", "
      }
    }
    newText += ", ["
    for (i1 = 0; i1 < this.neurons[this.neurons.length - 1].length; i1++) {
      newText += (this.neurons[this.neurons.length - 1][i1].bios)
      if (i1 < this.neurons[this.neurons.length - 1].length - 1) {
        newText += ", "
      }
    }
    newText += "], ["
    newText += (this.activationfunction) + ", "
    newText += (this.outputfunction)
    newText += "]]"
    return newText
  }

  this.createNN = function(varcode) {
    var code = varcode
    this.settings = []
    this.input = []
    this.neurons = []
    this.synapses = []
    for (i1 = 0; i1 < code[0].length; i1++) {
      this.input.push(0)
    }
    for (i1 = 0; i1 < code.length - 2; i1++) {
      this.neurons.push([])
      this.synapses.push([])
      var numbOfthislayerNeurons = 0
      for (i2 = 0; i2 < code[i1].length; i2++) {
        numbOfthislayerNeurons++
        if (i1 === 0) {
          var newNeuron = new InputNeuron(i1, i2)
          this.neurons[i1].push(newNeuron)
        } else {
          var newNeuronBios = code[i1][i2][0]
          var newNeuron = new Neuron(i1, i2, newNeuronBios)
          this.neurons[i1].push(newNeuron)
        }
        this.synapses[i1].push([])
        for (i3 = 1; i3 < code[i1][i2].length; i3++) {
          var newSynapseWeight = code[i1][i2][i3]
          var newSynapse = new Synapse(i1, i2, i1 + 1, i3 - 1, newSynapseWeight)
          this.synapses[i1][i2].push(newSynapse)
        }
      }
      this.settings.push(numbOfthislayerNeurons)
    }
    this.neurons.push([])
    for (i1 = 0; i1 < code[code.length - 2].length; i1++) {
      var newNeuronBios = code[code.length - 2][i1]
      var newNeuron = new OutputNeuron(code.length - 2, i1, newNeuronBios)
      this.neurons[this.neurons.length - 1].push(newNeuron)
    }
    this.activationfunction = code[code.length - 1][0]
    this.outputfunction = code[code.length - 1][1]
  }

  this.backpropagation = function(varwantedresult, varlernrate) {
    var wantedresult = varwantedresult
    var lernrate = varlernrate
    for (bi1 = this.neurons.length - 1; bi1 > 0; bi1--) {
      for (bi2 = 0; bi2 < this.neurons[bi1].length; bi2++) {
        var synapsed = []
        while (synapsed.length < this.synapses[bi1 - 1].length - 1) {
          var loop = 0
          var indexes = []
          while (loop !== false) {
            var index = floor(random(this.synapses[bi1 - 1].length))
            var indexed = false
            for (bi4 = 0; bi4 < synapsed.length; bi4++) {
              if (synapsed[bi4] === index) {
                indexed = true
              }
            }
            if (!indexed) {
              indexes.push(index)
              synapsed.push(index)
            }
            loop++
            if (indexes.length >= 2 || loop > 10000) {
              loop = false
            }
          }
          var fails = []
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (1.001 * lernrate)
          var lowestFail = 1000000000000000000000
          var lowestFailIndex = 0
          for (bi4 = 0; bi4 < fails.length; bi4++) {
            if (fails[bi4] < lowestFail) {
              lowestFail = fails[bi4]
              lowestFailIndex = bi4
            }
          }
          if (lowestFailIndex === 0) {

          } else if (lowestFailIndex == 1) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          } else if (lowestFailIndex == 2) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          } else if (lowestFailIndex == 3) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          } else if (lowestFailIndex == 4) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          }
        }
      }
    }
  }
  /*
  this.backpropagation = function(varwantedresult, varlernrate) {
    var wantedresult = varwantedresult
    var lernrate = varlernrate
    for (bi1 = this.neurons.length - 1; bi1 > 0; bi1--) {
      for (bi2 = 0; bi2 < this.neurons[bi1].length; bi2++) {
        fails.push(this.calculatefail(wantedresult))
        for (bi3 = 0; bi3 < this.synapses[bi1 - 1].length) {
          this.synapses[bi1 - 1][bi3][bi2].weight *= (1.001 * lernrate)
          for ()

          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (1.001 * lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          fails.push(this.calculatefail(wantedresult))
          this.synapses[bi1 - 1][indexes[0]][bi2].weight /= (0.999 / lernrate)
          this.synapses[bi1 - 1][indexes[1]][bi2].weight /= (1.001 * lernrate)
          var lowestFail = 1000000000000000000000
          var lowestFailIndex = 0
          for (bi4 = 0; bi4 < fails.length; bi4++) {
            if (fails[bi4] < lowestFail) {
              lowestFail = fails[bi4]
              lowestFailIndex = bi4
            }
          }
          if (lowestFailIndex === 0) {

          } else if (lowestFailIndex == 1) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          } else if (lowestFailIndex == 2) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          } else if (lowestFailIndex == 3) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (1.001 * lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (0.999 / lernrate)
          } else if (lowestFailIndex == 4) {
            this.synapses[bi1 - 1][indexes[0]][bi2].weight *= (0.999 / lernrate)
            this.synapses[bi1 - 1][indexes[1]][bi2].weight *= (1.001 * lernrate)
          }
        }
      }
    }
  }
  */

  this.calculatefail = function(wanted) {
    this.update()
    var returnfail = 0
    for (ci = 0; ci < this.output.length; ci++) {
      returnfail += sq(wanted[ci] - this.output[ci])
    }
    returnfail /= this.output.length
    return returnfail
  }
}

function Neuron(varlayer, varneuron, varbios) {
  this.layer = varlayer
  this.neuron = varneuron
  this.bios = varbios
  this.value = 10
  this.col = [255, 255, 255, 255]

  this.calculate = function(varsynapses, varlogicfunction) {
    var synapses = varsynapses
    var logicfunction = varlogicfunction
    var value = this.bios
    for (ii1 = 0; ii1 < synapses[this.layer - 1].length; ii1++) {
      value += synapses[this.layer - 1][ii1][this.neuron].value
    }
    if (logicfunction == 1) {
      value = 1 / (1 + exp(-value))
    }
    this.value = value
  }
}

function InputNeuron(varlayer, varneuron) {
  this.layer = varlayer
  this.neuron = varneuron
  this.bios = 0
  this.value = 10
  this.col = [0, 255, 255, 255]

  this.calculate = function(varinput) {
    var input = varinput
    this.value = input[this.neuron]
  }
}

function OutputNeuron(varlayer, varneuron, varbios) {
  this.layer = varlayer
  this.neuron = varneuron
  this.bios = varbios
  this.value = 10
  this.col = [100, 255, 100, 255]

  this.calculate = function(varsynapses, varoutputfunction) {
    var synapses = varsynapses
    var outputfunction = varoutputfunction
    var value = this.bios
    for (ii1 = 0; ii1 < synapses[this.layer - 1].length; ii1++) {
      value += synapses[this.layer - 1][ii1][this.neuron].value
    }
    if (outputfunction == 1) {
      value = 1 / (1 + exp(-value))
    }
    this.value = value
  }
}

function Synapse(varlayer1, varneuron1, varlayer2, varneuron2, varweight) {
  this.layer1 = varlayer1
  this.neuron1 = varneuron1
  this.layer2 = varlayer2
  this.neuron2 = varneuron2
  this.weight = varweight
  this.value = 0

  this.calculate = function(varneurons) {
    var neurons = varneurons
    var value = neurons[this.layer1][this.neuron1].value
    value *= this.weight
    this.value = value
  }
}

function crossover(a, b) {
  //this.code == [layer0[InputNeuron0[neuron0bios, synapse1weight, synapse2weight], InputNeuron1[neuron1bios, synapse1weight, synapse2weight]], layer1[neuron0[neuron0bios, synapse1weight, synapse2weight], neuron1[neuron1bios, synapse1weight, synapse2weight]], [outputNeuron1bios, outputNeuron2bios], [activationfunction, outputfunction]]
  var newCode = []
  var parent = floor(random(2))
  for (ii00 = 0; ii00 < a.length - 2; ii00++) {
    newCode.push([])
    for (ii11 = 0; ii11 < a[ii00].length; ii11++) {
      newCode[ii00].push([])
      for (ii22 = 0; ii22 < a[ii00][ii11].length; ii22 += bitLength) {
        var bitLength = floor(random(1, a[ii00][ii11].length / 2))
        if (ii22 + 1 + bitLength >= a[ii00][ii11].length) {
          bitLength = a[ii00][ii11].length - ii22
        }
        if (parent === 0) {
          for (ii33 = ii22 + 1; ii33 <= ii22 + bitLength; ii33++) {
            newCode[ii00][ii11].push(a[ii00][ii11][ii33 - 1])
          }
          parent += 1
        } else {
          for (ii33 = ii22 + 1; ii33 <= ii22 + bitLength; ii33++) {
            newCode[ii00][ii11].push(b[ii00][ii11][ii33 - 1])
          }
          parent -= 1
        }
      }
    }
  }
  newCode.push(a[a.length - 2])
  newCode.push(a[a.length - 1])
  return newCode
}

function mutate(varcode, varmutaterate) {
  for (ii00 = 0; ii00 < varcode.length - 2; ii00++) {
    for (ii11 = 0; ii11 < varcode[ii00].length; ii11++) {
      for (ii22 = 0; ii22 < varcode[ii00][ii11].length; ii22 ++) {
        if (random(1) < varmutaterate) {
          varcode[ii00][ii11][ii22] *= random(0.5, 1.5)
        }
        if (random(1) < varmutaterate / 5) {
          varcode[ii00][ii11][ii22] *= -1
        }
      }
    }
  }
  return varcode
}

function mutationCrossover(a, b, m) {
  //this.code == [layer0[InputNeuron0[neuron0bios, synapse1weight, synapse2weight], InputNeuron1[neuron1bios, synapse1weight, synapse2weight]], layer1[neuron0[neuron0bios, synapse1weight, synapse2weight], neuron1[neuron1bios, synapse1weight, synapse2weight]], [outputNeuron1bios, outputNeuron2bios], [activationfunction, outputfunction]]
  var newCode = []
  var parent = floor(random(2))
  for (ii00 = 0; ii00 < a.length - 2; ii00++) {
    newCode.push([])
    for (ii11 = 0; ii11 < a[ii00].length; ii11++) {
      newCode[ii00].push([])
      for (ii22 = 0; ii22 < a[ii00][ii11].length; ii22 += bitLength) {
        var bitLength = floor(random(1, a[ii00][ii11].length / 2))
        if (ii22 + 1 + bitLength >= a[ii00][ii11].length) {
          bitLength = a[ii00][ii11].length - ii22
        }
        if (parent === 0) {
          for (ii33 = ii22 + 1; ii33 <= ii22 + bitLength; ii33++) {
            if (random(1) >= m) {
              newCode[ii00][ii11].push(a[ii00][ii11][ii33 - 1])
            } else {
              var newbit = a[ii00][ii11][ii33 - 1] * random(0.5, 1.5)
              if (random(1) < m / 5) {
                newbit *= -1
              }
              newCode[ii00][ii11].push(newbit)
            }
          }
          parent += 1
        } else {
          for (ii33 = ii22 + 1; ii33 <= ii22 + bitLength; ii33++) {
            if (random(1) >= m) {
              newCode[ii00][ii11].push(b[ii00][ii11][ii33 - 1])
            } else {
              var newbit = b[ii00][ii11][ii33 - 1] * random(0.5, 1.5)
              if (random(1) < m / 5) {
                newbit *= -1
              }
              newCode[ii00][ii11].push(newbit)
            }
          }
          parent -= 1
        }
      }
    }
  }
  newCode.push(a[a.length - 2])
  newCode.push(a[a.length - 1])
  return newCode
}
