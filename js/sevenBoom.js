var gIsSevenBoom = false

function sevenBoomMode() {
    initGame(gLevel.SIZE, gLevel.MINES, gLevel.NAME)
    gIsSevenBoom = !gIsSevenBoom
}

function sevenBoomMines() {
    var counter = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const strCounter = counter + ''
            if (counter > 1 && counter % 7 === 0 || strCounter.includes('7')) {
                var cell = gBoard[i][j]
                cell.isMine = true
            }
            counter++
        }
    }
}
