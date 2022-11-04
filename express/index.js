const express = require("express")
const app = express()

const path = require("path")
const redditData = require("./data.json")

app.use(express.static(path.join(__dirname, '/public'))) // Serve static files such as JS scripts and CSS styles

app.set('view engine', 'ejs') // Set the templating engine to EJS
app.set('views', path.join(__dirname, '/views')) // Look for template files in the views folder

// Retreive the home page
app.get('/', (req, res) => {
    res.render('home') // will render the 'home.ejs' file in the 'views' folder
})

app.get('/random', (req, res) => {    
    const randomNum = Math.floor(Math.random() * 100) + 1
    res.render('random', { randomNum })
})

app.get('/cats', (req, res) => {
    const cats = [
        "Blue", "Rocket", "Monty", "Steph", "Winston"
    ]
    res.render('cats', { cats })
})

// Getting parameters out of the request
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params // subreddit = req.params.subreddit
    const data = redditData[subreddit]
    if (data){
        res.render('subreddit', { ...data })
    } else {
        res.send(`<h1>Sorry, we could not find the ${subreddit} subreddit!</h1>`)
    }

})

app.get('/r/:subreddit/:postId', (req, res) => {
    const { subreddit, postId } = req.params
    res.send(`<h1>Viewing Post: ${postId} on the ${subreddit} subreddit!</h1>`)
})

// Query strings
app.get('/search', (req, res) => {
    const { q } = req.query
    if(!q){
        res.send(`<h1>Nothing found if nothing searched!</h1>`)
    }
    res.send(`<h1>Searching for: ${q}</h1>`)
})

// Catch all get request
app.get('*', (req, res) => {
    res.send('<h1>404: Sorry that path was not found!</h1>')
})

// Listen server --> i.e. start the local server!
app.listen(8080, () => {
    // console.log('\033[2J'); // clear console
    console.log("Listening!")
})

