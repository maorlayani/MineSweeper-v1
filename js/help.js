const HELP = '💡'

var gIsHelp = false
var gCountHelps = 3

function renderHelps() {
    const elHelp = document.querySelector('.help-container')
    var strHTML = '<span class="helps show-feature">HELPS: '
    for (var i = 0; i < gCountHelps; i++) {
        strHTML += `<span class="help help-${i + 1} " onclick="clickedHelp(this,${i + 1})">${HELP}</span>`
    }
    strHTML += '</span>'
    elHelp.innerHTML = strHTML
}

function clickedHelp(elHelp) {
    if (gGame.shownCount === 0) return
    gIsHelp = !gIsHelp
    if (gIsHelp) elHelp.style.fontSize = '25px'
    else elHelp.style.fontSize = '20px'
}

function getHelp(i, j) {
    expandShown(gBoard, i, j)
    renderCell(i, j)
    setTimeout(() => {
        gIsHelp = !gIsHelp
        gCountHelps--
        renderHelps()
        undoPlay(i, j)
        return
    }, 1000);
}

function undoPlay(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue
            const cell = gBoard[i][j]
            if (cell.isShown) continue
            renderPrevPlay(i, j)
        }
    }
}

