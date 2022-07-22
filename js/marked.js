const FLAG = '🚩'

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    window.addEventListener("contextmenu", e => e.preventDefault());
    const cell = gBoard[i][j]

    if (cell.isShown) return
    if (cell.isMarked) {
        elCell.innerHTML = ''
        gGame.markedCount--
        cell.isMarked = false
        // Save the play
        gPrevPlay.push({ type: 'unmarked', i, j })
        gPrevPlays.push(gPrevPlay)
        gPrevPlay = []
        renderFlagsLeft()
        return
    }
    if (gGame.markedCount < gLevel.MINES) {
        elCell.innerHTML = FLAG
        cell.isMarked = true
        gGame.markedCount++
        // Save the play
        gPrevPlay.push({ type: 'marked', i, j })
        gPrevPlays.push(gPrevPlay)
        gPrevPlay = []
        renderFlagsLeft()
    }
    checkGameOver()
}

function renderFlagsLeft() {
    const elLife = document.querySelector('.flags')
    const strHTML = gLevel.MINES - gGame.markedCount
    elLife.innerText = strHTML
}