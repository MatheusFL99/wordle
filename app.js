var height = 6 // numero de tentantivas
var width = 5 // 5 letras

var line = 0
var column = 0

var correct = 0
var isGameOver = false

var countLevel1 = 0
var countLevel2 = 0
var countLevel3 = 0
var countLevel4 = 0
var countLevel5 = 0
var countLevel6 = 0
var countLevelfail = 0

function getWordle() {
  fetch('http://localhost:3000/word')
    .then(response => response.json())
    .then(json => {
      console.log(json)
      word = json.toUpperCase()
    })
    .catch(err => console.log(err))
}

function reload() {
  window.location.href=window.location.href
}

function gameOver() {
  if (isGameOver) {
    let winScreen = document.createElement('div')
    let cover = document.createElement('div')
    cover.classList.add('cover')
    cover.innerText = ''
    winScreen.classList.add('win-screen')
    winScreen.innerHTML = `<h1>Fim de jogo!</h1>
    <div id="answer"></div>
  <h2>Estatísticas:</h2>
  <p>1 Tentativa: ${countLevel1}</p>
  <p>2 Tentativas: ${countLevel2}</p> 
  <p>3 Tentativas: ${countLevel3}</p> 
  <p>4 Tentativas: ${countLevel4}</p> 
  <p>5 Tentativas: ${countLevel5}</p> 
  <p>6 Tentativas: ${countLevel6}</p> 
  <p>💀 Falhas: ${countLevelfail}</p> 
  <button id="playAgain" onclick = "reload()" >Jogar novamente</button>`
    document.getElementById('wordle').appendChild(winScreen)
  }
}


window.onload = function () {
  init()
}

function init() {
  line = 0
  column = 0
  correct = 0
  isGameOver = false

  getWordle()

  // cria o quadro
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let square = document.createElement('span')
      square.id = r.toString() + '-' + c.toString()
      square.classList.add('square')
      square.innerText = ''
      document.getElementById('board').appendChild(square)
    }
  }

  // cria o teclado virtual
  let keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ' '],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ]

  for (let i = 0; i < keyboard.length; i++) {
    let currLine = keyboard[i]
    let keyboardLine = document.createElement('div')
    keyboardLine.classList.add('keyboard-line')

    for (let j = 0; j < currLine.length; j++) {
      let keyTile = document.createElement('div')

      let key = currLine[j]
      keyTile.innerText = key
      if (key == 'Enter') {
        keyTile.id = 'Enter'
      } else if (key == '⌫') {
        keyTile.id = 'Backspace'
      } else if ('A' <= key && key <= 'Z') {
        keyTile.id = 'Key' + key
      }

      keyTile.addEventListener('click', processKey)

      if (key == 'Enter') {
        keyTile.classList.add('enter-square')
      } else {
        keyTile.classList.add('key-square')
      }
      keyboardLine.appendChild(keyTile)
    }
    document.body.appendChild(keyboardLine)
  }

  // escuta o teclado
  document.addEventListener('keyup', e => {
    processInput(e)
  })
}

function processKey() {
  e = { code: this.id }
  processInput(e)
}

function processInput(e) {
  if (isGameOver) return

  // alert(e.code)
  if ('KeyA' <= e.code && e.code <= 'KeyZ') {
    if (column < width) {
      let currSquare = document.getElementById(
        line.toString() + '-' + column.toString()
      )
      if (currSquare.innerText == '') {
        currSquare.innerText = e.code[3] // pega a letra digitada ([K][e][y]["LETRA"])
        column += 1
      }
    }
  } else if (e.code == 'Backspace') {
    if (0 < column && column <= width) {
      column -= 1
    }
    let currSquare = document.getElementById(
      line.toString() + '-' + column.toString()
    )
    currSquare.innerText = ''
  } else if (e.code == 'Enter') {
    if (column == width) {
      update()
    }
  }

  if (!isGameOver && line == height && correct != width) {
    switch (line) {
      case 0:
        countLevel1 += 1
        break
      case 1:
        countLevel2 += 1
        break
      case 2:
        countLevel3 += 1
        break
      case 3:
        countLevel4 += 1
        break
      case 4:
        countLevel5 += 1
        break
      case 5:
        countLevel6 += 1
        break
      default:
        countLevelfail += 1
    }
    isGameOver = true
    gameOver()
    document.getElementById('answer').innerText = 'Palavra escolhida: '+ word

  }
}

function update() {
  let guess = ''
  document.getElementById('answer').innerText = ''

  // coloca a letra digitada na tentativa
  for (let c = 0; c < width; c++) {
    let currSquare = document.getElementById(
      line.toString() + '-' + c.toString()
    )
    let letter = currSquare.innerText
    guess += letter
  }

  guess = guess.toLowerCase() // case sensitive
  console.log(guess)
  

  // processa a tentativa
  correct = 0

  let letterCount = {} // conta quantas letras repetidas tem
  for (let i = 0; i < word.length; i++) {
    let letter = word[i]

    if (letterCount[letter]) {
      letterCount[letter] += 1
    } else {
      letterCount[letter] = 1
    }
  }

  console.log(letterCount)

  for (let c = 0; c < width; c++) {
    let currSquare = document.getElementById(
      line.toString() + '-' + c.toString()
    )
    let letter = currSquare.innerText

    // condicao se esta na posicao certa
    if (word[c] == letter) {
      currSquare.classList.add('correct')

      let keyTile = document.getElementById('Key' + letter)
      keyTile.classList.remove('in-word')
      keyTile.classList.add('correct')

      correct += 1
      letterCount[letter] -= 1
    }

    if (correct == width) {
      switch (line) {
        case 0:
          countLevel1 += 1
          break
        case 1:
          countLevel2 += 1
          break
        case 2:
          countLevel3 += 1
          break
        case 3:
          countLevel4 += 1
          break
        case 4:
          countLevel5 += 1
          break
        case 5:
          countLevel6 += 1
          break
        default:
          countLevelfail += 1
      }
      isGameOver = true
      gameOver()
    }
  }

  console.log(letterCount)
  // marca as letras que estao presentes mas na posicao errada
  for (let c = 0; c < width; c++) {
    let currSquare = document.getElementById(
      line.toString() + '-' + c.toString()
    )
    let letter = currSquare.innerText

    // pula letra se for marcado como correto
    if (!currSquare.classList.contains('correct')) {
      // esta na palavra?
      if (word.includes(letter) && letterCount[letter] > 0) {
        currSquare.classList.add('in-word')

        let keyTile = document.getElementById('Key' + letter)
        if (!keyTile.classList.contains('correct')) {
          keyTile.classList.add('in-word')
        }
        letterCount[letter] -= 1
      } // nao esta na palavra
      else {
        currSquare.classList.add('not-in-word')
        let keyTile = document.getElementById('Key' + letter)
        keyTile.classList.add('not-in-word')
      }
    }
  }

  line += 1 // nova linha
  column = 0 // comeca da posicao 0 (primeira posicao)
}
