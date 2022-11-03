const express = require("express")
const app = express()

// app.use((req, res) => {
//     console.log("We got a new request!")
// })

// Retreive the home page
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the home page!</h1>')
})

app.get('/cats', (req, res) => {
    res.send('<h1>Meow!</h1>')
})

app.get('/dogs', (req, res) => {
    res.send('<h1>Woof!</h1>')
})

// Getting parameters out of the request
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params // subreddit = req.params.subreddit
    res.send(`<h1>This is the ${ subreddit } subreddit!</h1>`)
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

