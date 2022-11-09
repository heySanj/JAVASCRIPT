const path = require('path');
const methodOverride = require('method-override')
const express = require('express');
const app = express();
const morgan = require('morgan')

// ====================== MIDDLEWARE =============================

// // app.use runs on every request
// app.use((req, res, next) => {
//     console.log("THIS IS MY FIRST MIDDLEWARE!")
//     next() // Call the next middleware function
//     console.log("THIS IS MY FIRST MIDDLEWARE AFTER CALLING NEXT!")
// })
// app.use((req, res, next) => {
//     console.log("THIS IS MY SECOND MIDDLEWARE!")
//     return next() // return next to ensure nothing happens after it is called
// })

app.use(( req, res, next) => {
    req.requestTime = Date.now()
    console.log(req.method, req.path, )
    return next()
})

// Middleware that only executes when trying to reach /dogs
app.use('/dogs', ( req, res, next) => {
    console.log("I Love Dogs!")
    return next()
})

// Basic authentication on the /secret route
const verifyPassword = ( req, res, next) => {
    const { password } = req.query
    if(password === '1234'){
        return next()
    }
    res.send("Sorry you need a password!")
}

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
// To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))
// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

 // Serve static files such as JS scripts and CSS styles
app.use(express.static(path.join(__dirname, '/public')))

// Print out request information to the console
app.use(morgan('tiny'))

// ====================== MONGOOSE SETUP =============================

const mongoose = require('mongoose');
const Product = require('./models/product');
const { nextTick } = require('process');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("=========== MongoDB Connection Open! ==========")
    })
    .catch(err => {
        console.log("MONGODB - ERROR: ", err)
    })

// ====================== OTHER SETUP =============================

const categories = ['fruit', 'vegetable', 'dairy']

// ======================= ROUTE SETUP ============================

app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.redirect('/products')
})

// Return all products from the database
app.get('/products', async (req, res) => {

    const filter = req.query.category

    // Queries to the database should be awaited, as they can take time to resolve
    let products = await Product.find({})    
    if(filter){
        products = await Product.find({category: filter})
        res.render('products/index', { products, categories, filter })
    } else {    
        res.render('products/index', { products, categories, filter: 'all' })
    }
})

// Add a product to the database
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

// Posting a new prduct
app.post('/products', async (req, res) => {

    // Passing data directly into a new product is not safe
    // as we aren't doing any checks on the input
    const newProduct = new Product(req.body)
    await newProduct.save()

    res.redirect(`/products/${newProduct._id}`)
})

// Get product by ID and show details
app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/details', { product })
})

// Edit a product
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})

// Updating a prduct
app.put('/products/:id', async (req, res) => {

    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})

    res.redirect(`/products/${product._id}`)
})

// Deleting a prduct
app.delete('/products/:id', async (req, res) => {

    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    res.redirect(`/products`)
})

// Secret page
app.get('/secret', verifyPassword, (req, res) => {
    res.send("<h1>You found the secret!</h1>")
})

// If no page was found
app.use((req, res) => {
    res.status(404).send("404: NOT FOUND")
})

// ===================================================================

app.listen(8080, () => {
    console.log("=========== Listening on port: 8080 ===========")
})