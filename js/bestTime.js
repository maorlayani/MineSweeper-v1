
function checkBestTime(level) {
    const currLevel = level
    var elLastGameTime = document.querySelector('.timer').innerText
    if (localStorage.getItem(currLevel)) {
        if (elLastGameTime !== 0 && elLastGameTime < parseInt(localStorage.getItem(currLevel))) {
            elLastGameTime += ''
            localStorage.setItem(currLevel, elLastGameTime)
        }
    } else {
        elLastGameTime += ''
        localStorage.setItem(currLevel, elLastGameTime)
    }
    document.querySelector('.best-time').innerText = localStorage.getItem(currLevel)
}


function renderBestTime() {
    const elBestTime = document.querySelector('.best-time')
    if (gLevel.NAME === 'beginner') {
        elBestTime.innerText = localStorage.beginner ? localStorage.beginner : 0
    }
    else if (gLevel.NAME === 'medium') {
        elBestTime.innerText = localStorage.medium ? localStorage.medium : 0
    }
    else if (gLevel.NAME === 'expert') {
        elBestTime.innerText = localStorage.expert ? localStorage.expert : 0
    }
}