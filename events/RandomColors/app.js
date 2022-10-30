// Center the text
document.body.style.textAlign = 'center'

// Generate random RGB colours
function randomColour(){
    const r = Math.floor(Math.random() * 255) + 1
    const g = Math.floor(Math.random() * 255) + 1
    const b = Math.floor(Math.random() * 255) + 1
    return `rgb(${r}, ${g}, ${b})`
}

// on click
const button = document.querySelector('button')
const heading = document.querySelector('h1')
button.addEventListener('click', () => {
    const colour = randomColour()
    document.body.style.backgroundColor = colour
    heading.innerHTML = colour
})