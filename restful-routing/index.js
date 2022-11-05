const path = require('path');
const methodOverride = require('method-override')
const { v4: uuid } = require('uuid'); //For generating ID's
const express = require('express');
const app = express();

// ============= USE THE FOLLOWING MIDDLEWARE ================

app.use(express.urlencoded({ extended: true })) //To parse form data in POST request body:
app.use(express.json()) // To parse incoming JSON in POST request body:
app.use(methodOverride('_method')) // To 'fake' put/patch/delete requests as HTML forms only do POST and GET

// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/public'))) // Serve static files such as JS scripts and CSS styles

// ======================================================================================================

// GET /comments - list all comments
// POST /comments - Create a new comment 
// GET /comments/:id - Get one comment (using ID)
// PATCH /comments/:id - Update one comment
// DELETE /comments/:id - Destroy one comment

// Our fake database:
let comments = [
    {
        id: uuid(),
        username: 'Todd',
        comment: 'lol that is so funny!'
    },
    {
        id: uuid(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog'
    },
    {
        id: uuid(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuid(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
]

// ======================================================================================================


// Retreive the home page
app.get('/', (req, res) => {
    res.render('home') // will render the 'home.ejs' file in the 'views' folder
})

// Index --> display all comments
app.get('/comments', (req, res) => {
    res.render('comments/index', {comments})
})

// New --> A form to create new comments
app.get('/comments/new', (req, res) => {    
    res.render('comments/new')
})

// Create --> submit the form data from new to create a new comment
app.post('/comments', (req, res) => {
    const { username, comment } = req.body // This will pull the data entered into the form
    const newComment = {
        id: uuid(),
        username: username,
        comment: comment
    }
    comments.push(newComment)
    // res.render('comments/index', {comments}) // DONT RE-RENDER --> INSTEAD REDIRECT!
    res.redirect('/comments')
})

// Show -- show details of 1 specific comment / resource
app.get('/comments/:id', (req, res) => {
    const { id } = req.params
    const comment = comments.find(c => c.id == id)
    res.render('comments/show', { comment })
})

// Edit a comment
app.patch('/comments/:id', (req, res) => {    
    const { id } = req.params
    const commentObj = comments.find(c => c.id == id)
    const newCommentText = req.body.newComment;    
    commentObj.comment = newCommentText
    res.redirect('/comments')
})

// Delete a comment
app.delete('/comments/:id', (req, res) => {    
    const { id } = req.params
    comments = comments.filter(c => c.id !== id) // Filter out the comment with matching ID
    res.redirect('/comments')
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

