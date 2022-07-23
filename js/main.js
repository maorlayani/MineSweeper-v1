const LIVE = '💗'
const RESET_SMILEY = '😀'
const WIN_SMILEY = '😎'

var gNumLives

var gBoard = []
var gLevel = {
    SIZE: 0,
    MINES: 0,
    NAME: ''
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame(size = 4, mines = 2, name = 'beginner') {
    gGame.isOn = true
    gLevel.SIZE = size
    gLevel.MINES = mines
    gLevel.NAME = name
    resetGame()
    renderTimer()
    gBoard = buildBoard()
    renderBoard(gBoard)
    renderFlagsLeft()
    renderLives()
    renderHelps()
    renderCellBySelector('.safe-count', gCountSafeClick)
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

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    // Set mines
    if (!gStartTime) {
        if (gIsSevenBoom) sevenBoomMines()
        else if (gIsManualMode && gCountMineManual < gLevel.MINES) {
            manualAddMine(elCell, i, j)
            return
        } else if (gCountMineManual === 0) addMines(gBoard, gLevel.MINES, cell)
        setMinesNegsCount(gBoard)
        startTimer()
    }
    // Get help
    if (gIsHelp) {
        if (cell.isShown) return
        getHelp(i, j)
        return
    }
    // Clicked on marked cell
    if (cell.isMarked) return
    // Clicked on mine
    if (cell.isMine) {
        if (!gIsHelp && gNumLives > 0) {
            clickedOnMine()
        } else {
            revealdMines()
        }
    }
    // Update Model
    if (!cell.isMine) {
        cell.isShown = true
        gGame.shownCount++
    }
    console.log('gGame.shownCount AFTER NUM CELL', gGame.shownCount)
    // Update DOM
    if (cell.minesAroundCount === 0 && !cell.isMine) {
        fullExpand(gBoard, i, j)
        // Save the play
        gPrevPlays.push(gPrevPlay)
        gPrevPlay = []
    } else {
        // Save the play
        gPrevPlay.push({ type: 'show', i, j })
        gPrevPlays.push(gPrevPlay)
        gPrevPlay = []
    }
    renderCell(i, j)
    checkGameOver()
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === rowIdx && j === colIdx) continue

            const cell = board[i][j]
            if (!gIsHelp) {
                if (!cell.isMine && !cell.isMarked && !cell.isShown) {
                    renderCell(i, j)
                }
            } else renderCell(i, j)
        }
    }
}

function fullExpand(board, rowIdx, colIdx) {
    gPrevPlay.push({ type: 'show', i: rowIdx, j: colIdx })

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === rowIdx && j === colIdx) continue

            const cell = board[i][j]

            if (!cell.isMine && !cell.isMarked && !cell.isShown) {
                gPrevPlay.push({ type: 'show', i, j })
                cell.isShown = true
                gGame.shownCount++
                renderCell(i, j)

                if (cell.minesAroundCount === 0) {
                    fullExpand(board, i, j)
                } else continue
            }
        }
    }
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

function renderLives() {
    const elLife = document.querySelector('.lives')
    var strHTML = ''
    for (var i = 0; i < gNumLives; i++) {
        strHTML += `${LIVE}`
    }
    elLife.innerText = strHTML
}

function checkGameOver() {
    const shownCells = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    if (gGame.shownCount === shownCells && gGame.markedCount === gLevel.MINES) {
        document.querySelector('.smiley').innerText = WIN_SMILEY
        gGame.isOn = false
        stopTimer()
        checkBestTime(gLevel.NAME)
    }
}

function restart() {
    initGame(gLevel.SIZE, gLevel.MINES, gLevel.NAME)
}

function resetGame() {
    stopTimer()
    clearTimeout(gSafeClickTimeoutId)
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gNumLives = (gLevel.SIZE === 4) ? 1 : 3
    gCountHelps = 3
    gCountSafeClick = 3
    gCountMineManual = 0
    gIsManualMode = false
    gIsSevenBoom = false
    gPrevPlays = []
    document.querySelector('.smiley').innerText = RESET_SMILEY
    renderBestTime()
}






