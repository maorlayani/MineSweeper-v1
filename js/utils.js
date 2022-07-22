function renderCellBySelector(selector, value) {
    const elCell = document.querySelector(selector)
    elCell.innerText = value
}

function getClassName(location) {
    const cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function countNeighbors(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            const cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}
