'use strict'

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard = []
var gInterval
var gStartTime

var gLives = 3

const SMILE = '😀'
const MINED = '😵'
const MINE = '💣 '
const FLAG = '⛳'
const VICTORY = '😎'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
}

function initGame() {
    gGame.shownCount = 0
    gGame.markedCount = 0
    gLives = 3
    var elShown = document.querySelector('.shown')
    elShown.innerText = 0
    var elMarked = document.querySelector('.marked')
    elMarked.innerText = 0
    var ellives = document.querySelector('.lives')
    ellives.innerText = 3
    var elbtn = document.querySelector('.newGame button')
    elbtn.innerText = SMILE


    buildBoard()
    
    setMinesRandom(gBoard, gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board')
    gGame.isOn = true
}

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                form: ''
            }
            gBoard[i][j] = cell
        }
    }
    return gBoard
}

function setMinesRandom(board, MINES) {
    var count = 0
    while (count < MINES) {
        var ranIdxI = getRandomInt(0, gLevel.SIZE - 1)
        var ranIdxJ = getRandomInt(0, gLevel.SIZE - 1)
        if (board[ranIdxI][ranIdxJ].form === MINE) continue
        // if (board[ranIdxI][ranIdxJ].isShown) continue
        board[ranIdxI][ranIdxJ].form = MINE
        board[ranIdxI][ranIdxJ].isMine = true
        count++
    }
}

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isMine) {

                getMinesNegsCount(board, i, j)

            }
        }
    }
}

function getMinesNegsCount(board, indexI, indexJ) {

    for (var i = indexI - 1; i <= indexI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = indexJ - 1; j <= indexJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if (i === indexI && j === indexJ) continue

            board[i][j].minesAroundCount++

        }
    }
}

function renderBoard(board, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = board[i][j]

            var className = 'cell cell-' + i + '-' + j;

            if (cell.isShown) {
                if (cell.isMine) {
                    strHTML += `<td class="${className}" 
                onclick="cellClicked(this, ${i}, ${j})"
                oncontextmenu="cellMarked(this, ${i}, ${j})">
            ${cell.form} 
            </td>`;
                }
                else {
                    strHTML += `<td class="${className}"
                onclick="cellClicked(this, ${i}, ${j})"
                oncontextmenu="cellMarked(this, ${i}, ${j})">
            ${cell.minesAroundCount}
            </td>`;
                }
            }
            else {
                strHTML += `<td class="${className}" 
            onclick="cellClicked(this, ${i}, ${j})"
            oncontextmenu="cellMarked(this, ${i}, ${j})">
        ${' '} 
        </td>`;

            }

        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML


}

function cellClicked(elCell, i, j) {

    if (gGame.shownCount === 0 && gBoard[i][j].isMine) {
        var count = 0
        for (var k = 0; k < gLevel.SIZE; k++) {
            for (var n = 0; n < gLevel.SIZE; n++) {
                if (!gBoard[k][n].isMine) {
                    gBoard[k][n].form = MINE
                    gBoard[k][n].isMine = true
                    gBoard[i][j].form = ''
                    gBoard[i][j].isMine = false
                    count++
                    break

                }
            }
            if (count === 1) {
                for (var k = 0; k < gLevel.SIZE; k++) {
                    for (var n = 0; n < gLevel.SIZE; n++) {

                        gBoard[k][n].minesAroundCount = 0

                    }
                }
                setMinesNegsCount(gBoard)
                break
            }
        }
    }


    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return

    if (!gBoard[i][j].isMine) {

        if (gBoard[i][j].minesAroundCount === 0) {
            gBoard[i][j].isShown = true
            elCell.innerHTML = ''
            elCell.style.background = '#777'
            gGame.shownCount++
            var elShown = document.querySelector('.shown');
            elShown.innerText++
            expandShown(i, j)

        }
        else {
            gBoard[i][j].isShown = true
            elCell.innerHTML = gBoard[i][j].minesAroundCount
            gGame.shownCount++
            var elShown = document.querySelector('.shown');
            elShown.innerText++

        }

        if (!gInterval) {
            gStartTime = new Date();
            gInterval = setInterval(renderTime, 1);
        }
    }
    else {
        if (gLives === 1) {
            showMines()
            gGame.isOn = false
            gLives = 0
            var ellives = document.querySelector('.lives');
            ellives.innerText--
        }
        else {
            elCell.innerHTML = MINE
            gBoard[i][j].isShown = true
            gLives--
            var ellives = document.querySelector('.lives');
            ellives.innerText--
            gLevel.MINES--

        }

    }

    checkGameOver()
}

function renderTime() {
    var elTime = document.querySelector('.time')

    if (gStartTime) {
        var timeNow = new Date()
        var seconds = Math.floor((timeNow - gStartTime) / 1000)
        elTime.innerText = `${seconds}`
    } else {
        elTime.innerText = '0'
    }
}

function changeGameSize(size, mines) {
    gStartTime = 0
    clearInterval(gInterval)
    gInterval = 0
    renderTime()
    gLevel.SIZE = size
    gLevel.MINES = mines

    initGame()
}

function newGame() {

    gStartTime = 0
    clearInterval(gInterval)
    gInterval = 0
    renderTime()

    if (gLevel.SIZE === 4)gLevel.MINES=2
    if (gLevel.SIZE === 8)gLevel.MINES=12
    if (gLevel.SIZE === 12)gLevel.MINES=30
    initGame()
}

function expandShown(indexI, indexJ) {
    if (!gGame.isOn) return
    for (var i = indexI - 1; i <= indexI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = indexJ - 1; j <= indexJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if (i === indexI && j === indexJ) continue
            if (gBoard[i][j].isShown) continue
            gBoard[i][j].isShown = true
            gGame.shownCount++
            var elShown = document.querySelector('.shown')
            elShown.innerText++
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (gBoard[i][j].minesAroundCount !== 0)
                elCell.innerHTML = gBoard[i][j].minesAroundCount
            else {
                elCell.innerHTML = ''
                elCell.style.background = '#777'
                gBoard[i][j].isShown = true
                expandShown(indexI, indexJ)
            }
            checkGameOver()
        }
    }
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    if (!gInterval) {
        gStartTime = new Date()
        gInterval = setInterval(renderTime, 1)
    }

    if (gBoard[i][j].form === FLAG) {
        var elCel = document.querySelector(`.cell-${i}-${j}`)
        elCel.innerHTML = ' '
        gBoard[i][j].isShown = false
        gBoard[i][j].form = ' '
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        var elMarked = document.querySelector('.marked');
        elMarked.innerText--

    }
    else if (gBoard[i][j].isShown) return
    else {
        var elCel = document.querySelector(`.cell-${i}-${j}`)
        gBoard[i][j].isShown = true
        elCel.innerHTML = FLAG
        gBoard[i][j].form = FLAG
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        var elMarked = document.querySelector('.marked')
        elMarked.innerText++
    }

    checkGameOver()
}

function checkGameOver() {
    if (!gGame.isOn) {
        
        gStartTime = 0
        clearInterval(gInterval)
        gInterval = 0;
        var elbtn = document.querySelector('.newGame button')
        elbtn.innerText = MINED
    }

    if (gLevel.SIZE === 4) {
        if (gGame.shownCount === 14 && gGame.markedCount === gLevel.MINES) {
            
            gStartTime = 0
            clearInterval(gInterval)
            gInterval = 0;
            gGame.isOn = false
            var elbtn = document.querySelector('.newGame button')
            elbtn.innerText = VICTORY
        }
    }
    else if (gLevel.SIZE === 8) {
        if (gGame.shownCount === 52 && gGame.markedCount === gLevel.MINES) {
            
            gStartTime = 0
            clearInterval(gInterval)
            gInterval = 0;
            gGame.isOn = false
            var elbtn = document.querySelector('.newGame button')
            elbtn.innerText = VICTORY
        }
    }
    else if (gLevel.SIZE === 12) {
        if (gGame.shownCount === 114 && gGame.markedCount === gLevel.MINES) {
            
            gStartTime = 0
            clearInterval(gInterval)
            gInterval = 0;
            gGame.isOn = false
            var elbtn = document.querySelector('.newGame button')
            elbtn.innerText = VICTORY
        }
    }


}

function showMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                var elCel = document.querySelector(`.cell-${i}-${j}`)
                elCel.innerHTML = MINE
                gBoard[i][j].isShown = true
            }
        }
    }
}
