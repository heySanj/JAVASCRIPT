// Control Elements
const p1Display = document.querySelector('#p1Display')
const p2Display = document.querySelector('#p2Display')
const p1Button = document.querySelector('#p1Button')
const p2Button = document.querySelector('#p2Button')
const resetButton = document.querySelector('#reset')
const dropDown = document.querySelector('#playto')

// Score management
let p1Score = 0
let p2Score = 0
let playTo = 3

function reset(){
    p1Score = 0
    p2Score = 0
    p1Button.disabled = false
    p2Button.disabled = false
    p1Display.classList.remove('has-text-success')
    p1Display.classList.remove('has-text-danger')
    p2Display.classList.remove('has-text-success')
    p2Display.classList.remove('has-text-danger')
    refreshScore()
}

function refreshScore(){
    p1Display.innerHTML = p1Score
    p2Display.innerHTML = p2Score
}

dropDown.addEventListener('change', () => {
    reset()
    playTo = dropDown.value
})

p1Button.addEventListener('click', () => {
    p1Score++
    refreshScore()
    checkWin()
})

p2Button.addEventListener('click', () => {
    p2Score++
    refreshScore()
    checkWin()
})

resetButton.addEventListener('click', reset)

// Game conditionals
function checkWin(){
    if(p1Score >= playTo || p2Score >= playTo){
        p1Button.disabled = true
        p2Button.disabled = true
        if(p1Score > p2Score){
            p1Display.classList.toggle('has-text-success')
            p2Display.classList.toggle('has-text-danger')
        } else {
            p2Display.classList.toggle('has-text-success')
            p1Display.classList.toggle('has-text-danger')
        }
    }
}