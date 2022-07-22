var gStartTime
var gGameIntervalId

function startTimer() {
    gStartTime = Date.now()
    gGameIntervalId = setInterval(setTimer, 1000)
}

function setTimer() {
    const diffTime = (Date.now() - gStartTime) / 1000
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