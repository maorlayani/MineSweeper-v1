
const MINE = '💥'
const FLAG = '🚩'
const LIVE = '💗'

var gBoard = []
var gLevel = {
    SIZE: 0,
    MINES: 0
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gStartTime
var gGameIntervalId
var gNumLives


function initGame(size = 4, mines = 2) {
    stopTimer()
    gGame.isOn = true
    gLevel.SIZE = size
    gLevel.MINES = mines
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    renderTimer()
    gNumLives = (gLevel.SIZE === 4) ? 1 : 3
    gBoard = buildBoard()
    renderBoard(gBoard)
    renderLives()
    document.querySelector('.smiley').innerText = '😀'

}

function buildBoard() {
    const SIZE = gLevel.SIZE
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board
}

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {

            const className = 'cell cell-' + i + '-' + j
            strHTML +=
                `<td class="${className}" oncontextmenu="cellMarked(this, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.board-container')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            var countMine = countNeighbors(board, i, j)
            cell.minesAroundCount = countMine
        }
    }
}
function countNeighbors(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue

            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    const cell = gBoard[i][j]

    if (!gStartTime) {
        startTimer()
        addMines(gBoard, gLevel.MINES, cell)
        setMinesNegsCount(gBoard)
    }

    if (cell.isMarked) return

    if (cell.isMine) {
        renderCell(i, j)
        if (gNumLives > 0) {
            gNumLives--
            gGame.shownCount--
            gGame.markedCount++
            renderLives(gNumLives)
        } else {
            revealdMines()
        }
    }
    cell.isShown = true
    gGame.shownCount++
    if (cell.minesAroundCount === 0 && !cell.isMine) {
        expandShown(gBoard, i, j)
    }
    renderCell(i, j)
    checkGameOver()
}

function renderCell(i, j) {
    const cell = gBoard[i][j]
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if (cell.isMine) {
        elCell.innerHTML = MINE
    } else {
        elCell.innerHTML = (cell.minesAroundCount === 0 || cell.isMine) ? '' : cell.minesAroundCount
    }
    elCell.classList.add('is-shown')
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    window.addEventListener("contextmenu", e => e.preventDefault());
    var cell = gBoard[i][j]

    if (cell.isShown) return
    if (cell.isMarked === true) {
        elCell.innerHTML = ''
        gGame.markedCount--
        cell.isMarked = false
        return
    }
    if (gGame.markedCount < gLevel.MINES) {
        elCell.innerHTML = FLAG
        cell.isMarked = true
        gGame.markedCount++
    }
    checkGameOver()
}

function checkGameOver() {
    var shownCells = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    if (gGame.shownCount === shownCells && gGame.markedCount === gLevel.MINES) {
        document.querySelector('.smiley').innerText = '😎'
        gGame.isOn = false
        stopTimer()
    }
}

function expandShown(board, rowIdx, colIdx) {
    var cell = board[rowIdx][colIdx]

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === rowIdx && j === colIdx) continue

            var cell = board[i][j]
            if (!cell.isMine && !cell.isMarked && !cell.isShown) {
                cell.isShown = true
                gGame.shownCount++
                renderCell(i, j)
            }
        }
    }
}


function addMines(board, numMines, currCell) {
    for (var i = 0; i < numMines; i++) {
        var randIdxI = getRandomInt(0, board.length)
        var randIdxJ = getRandomInt(0, board.length)
        var cell = board[randIdxI][randIdxJ]
        if (!cell.isMine && cell !== currCell) cell.isMine = true
        else numMines++
    }
}



function revealdMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) renderCell(i, j)
        }
    }
    document.querySelector('.smiley').innerText = '😵'
    gGame.isOn = false
    stopTimer()
}

function startTimer() {
    gStartTime = Date.now()
    gGameIntervalId = setInterval(setTimer, 1000)
}

function setTimer() {
    var diffTime = (Date.now() - gStartTime) / 1000
    gGame.secsPassed = diffTime.toFixed(0)
    renderTimer()
}
function renderTimer() {
    document.querySelector('.timer').innerText = gGame.secsPassed
}

function stopTimer() {
    clearInterval(gGameIntervalId)
    gGameIntervalId = null
    gStartTime = null

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}


function renderLives() {
    var elLife = document.querySelector('.lives')
    var strHTML = ''
    for (var i = 0; i < gNumLives; i++) {
        strHTML += `${LIVE}`
    }
    elLife.innerText = strHTML
}

