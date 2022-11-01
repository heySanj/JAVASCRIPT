const jokes = document.querySelector('#jokes')
const button = document.querySelector('button')

const addNewJoke = async () => {
    try {
        const jokeText = await getDadJoke()
        const newLI = document.createElement('li')
        newLI.append(jokeText)
        jokes.append(newLI)
    } catch (error) {
        console.log("Error: ", error)
    }
}

const getDadJoke = async () => {
    try {
        const config = { headers: { Accept: 'application/json' }}
        const res = await axios.get('https://icanhazdadjoke.com/', config)
        return res.data.joke
    } catch (error) {
        return "No jokes available, sorry.. 😞"
    }
}

button.addEventListener('click', addNewJoke)