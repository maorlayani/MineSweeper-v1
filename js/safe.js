
var gSafeClickTimeoutId

var gIsSafeClicked = false
var gCountSafeClick = 3

function getSafeCells() {
    const safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            const cell = { i, j }
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown)
                safeCells.push(cell)
        }
    }
    return safeCells
}

function getRandomSafeCell() {
    const safeCells = getSafeCells()
    const randIdx = getRandomInt(0, safeCells.length)
    return safeCells[randIdx]
}

function showSafeCell() {
    if (gIsSafeClicked) return
    gIsSafeClicked = !gIsSafeClicked
    const safeCellIdx = getRandomSafeCell()
    renderSafeCell(safeCellIdx)
    gCountSafeClick--
    renderCellBySelector('.safe-count', gCountSafeClick)
}

function renderSafeCell(location) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector);
    elCell.classList.add('blink-me')
    gSafeClickTimeoutId = setTimeout(() => {
        elCell.classList.remove('blink-me')
        gIsSafeClicked = !gIsSafeClicked
    }, 2000);
}