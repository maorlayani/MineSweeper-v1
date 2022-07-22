var gPrevPlay = []
var gPrevPlays = []

function undo() {
    if (!gGame.isOn) return
    const lastPlay = gPrevPlays.pop()
    if (!lastPlay) return
    for (var i = 0; i < lastPlay.length; i++) {
        renderPrevPlay(lastPlay[i].i, lastPlay[i].j, lastPlay[i].type)
    }
}

function renderPrevPlay(i, j, value) {
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    const cell = gBoard[i][j]
    if (value === 'show') {
        elCell.classList.remove('is-shown')
        if (cell.isShown && !cell.isMine) {
            cell.isShown = false
            gGame.shownCount--
        }
        if (cell.isMine) {
            cell.isShown = false
            gGame.markedCount--
        }
    } else if (value === 'marked') {
        cell.isMarked = !cell.isMarked
        elCell.innerHTML = ''
        gGame.markedCount--
    } else if (value === 'unmarked') {
        cell.isMarked = !cell.isMarked
        elCell.innerHTML = FLAG
        gGame.markedCount++
    }
    renderFlagsLeft()

    if (!gIsHelp) {
        elCell.classList.remove('is-shown')
        if (cell.isMarked) elCell.innerHTML = FLAG
        else elCell.innerHTML = ''
    }
}