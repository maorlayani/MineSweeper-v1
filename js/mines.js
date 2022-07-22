const MINE = '💣'
const LOSE_SMILEY = '😵'

var gIsManualMode = false
var gCountMineManual = 0

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            const cell = board[i][j]
            const countMine = countNeighbors(board, i, j)
            cell.minesAroundCount = countMine
        }
    }
}

function addMines(board, numMines, currCell) {
    for (var i = 0; i < numMines; i++) {
        const randIdxI = getRandomInt(0, board.length)
        const randIdxJ = getRandomInt(0, board.length)
        const cell = board[randIdxI][randIdxJ]
        if (!cell.isMine && cell !== currCell) cell.isMine = true
        else numMines++
    }
}

function clickedOnMine() {
    gNumLives--
    gGame.markedCount++
    renderLives(gNumLives)
    renderFlagsLeft()
    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = LOSE_SMILEY
    setTimeout(() => {
        elSmiley.innerText = RESET_SMILEY
    }, 400);
}

function revealdMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine) renderCell(i, j)
        }
    }
    document.querySelector('.smiley').innerText = LOSE_SMILEY
    gGame.isOn = false
    stopTimer()
}

function manualMode() {
    if (gGame.shownCount !== 0 || gGame.markedCount !== 0) return
    gIsManualMode = !gIsManualMode
    if (gIsManualMode) toggleManualModeColor('#fcd085')
    else toggleManualModeColor('#F79489')
}


function toggleManualModeColor(color) {
    for (var i = 0; i < gBoard.length * gBoard.length; i++) {
        const elCells = document.querySelectorAll('.cell')
        elCells[i].style.borderColor = color
    }
}

function manualAddMine(elCell, i, j) {
    gBoard[i][j].isMine = true
    gCountMineManual++
    renderCell(i, j)
    setTimeout(() => {
        elCell.classList.remove('is-shown')
        elCell.innerHTML = ''
    }, 1000);
    if (gCountMineManual === gLevel.MINES) {
        toggleManualModeColor('#F79489')
    }
}

