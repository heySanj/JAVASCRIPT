// Generate random RGB colours
function randomColour(){
    const r = Math.floor(Math.random() * 255) + 1
    const g = Math.floor(Math.random() * 255) + 1
    const b = Math.floor(Math.random() * 255) + 1
    return `rgb(${r}, ${g}, ${b})`
}

function changeColour(){
    this.style.backgroundColor = randomColour()
    this.style.color = randomColour()
}

// on click
const allButtons = document.querySelectorAll('button')
for(let button of allButtons){
    button.addEventListener('click', changeColour)
}

const allH1s = document.querySelectorAll('h1')
for (const h1 of allH1s) {
    h1.addEventListener('click', changeColour)
}
