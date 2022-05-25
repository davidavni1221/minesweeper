'use strict'

 var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard = [];
var gInterval
var gStartTime
const SMILE = '😀';
const SAD = '😵';
const MINE = '💣 ';

function initGame() {
    buildBoard()
    console.log(gBoard)
    setMinesRandom(gBoard,gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board')
}

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
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
    return gBoard;
}

function setMinesRandom(board,MINES) {
    for (var i = 0; i < MINES; i++) {

        var ranIdxI = getRandomInt(0, gLevel.SIZE - 1)
        var ranIdxJ = getRandomInt(0, gLevel.SIZE - 1)
        board[ranIdxI][ranIdxJ].form = MINE
        board[ranIdxI][ranIdxJ].isMine = true

    }
}

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isMine) {
                console.log(board[i][j])
                getMinesNegsCount(board, i, j)

            }
        }
    }
}

function getMinesNegsCount(board, indexI, indexJ) {

    for (var i = indexI - 1; i <= indexI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = indexJ - 1; j <= indexJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === indexI && j === indexJ) continue;
            if (board[i][j].isMine) continue;
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
                onclick="cellClicked(this, ${i}, ${j})">
            ${cell.form} 
            </td>`;
                }
                else {
                    strHTML += `<td class="${className}"
                onclick="cellClicked(this, ${i}, ${j})">
            ${cell.minesAroundCount}
            </td>`;
                }
            }
            else {
                strHTML += `<td class="${className}" 
            onclick="cellClicked(this, ${i}, ${j})">
        ${' '} 
        </td>`;

            }

        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

    console.log(strHTML)
}

function cellClicked(ev,elCel, i, j) {
console.log(ev)

    if (!gBoard[i][j].isMine) {
        // if (gBoard[i][j].minesAroundCount===0){

        // }
        gBoard[i][j].isShown = true
        elCel.innerHTML = gBoard[i][j].minesAroundCount
        console.log('cellClicked')

        if (!gInterval) {
            gStartTime = new Date();
            gInterval = setInterval(renderTime, 1);
        }

    }
    else {
        gBoard[i][j].isShown = true
        elCel.innerHTML = gBoard[i][j].form
        console.log('cellClicked')
    }

}

function getRandomArray(length) {
    var nums = [];

    for (var i = 0; i < length; i++) {
        nums[i] = i + 1;
    }

    nums = shuffleArray(nums);

    return nums;
}

function shuffleArray(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function renderTime() {
    var elTime = document.querySelector('.time');

    if (gStartTime) {
        var timeNow = new Date();
        var seconds = Math.floor((timeNow - gStartTime) / 1000);
        var milliseconds = (timeNow - gStartTime) % 100;
        elTime.innerText = `${seconds}.${milliseconds}`;
    } else {
        elTime.innerText = '0.00';
    }
}

function changeGameSize(size) {
    gStartTime = 0
    clearInterval(gInterval)
    gInterval = 0;
    renderTime()
    gLevel.SIZE = size
    if(size===4)
    gLevel.MINES===2
    if(size===8)
    gLevel.MINES===12
    if(size===12)
    gLevel.MINES===30

    initGame()
}

function newGame(){
    gStartTime = 0
    clearInterval(gInterval)
    gInterval = 0;
    renderTime()
    initGame()
}

// function renderCell(elCel, i, j) {

//     var elCell = document.querySelector(`.cell-${i}-${j}`)
//     elCell.innerHTML
// }

document.getElementsByClassName("cell").onmousedown = function(event) {
    if (event.which == 3) {
        alert("right clicked!");
    }
}