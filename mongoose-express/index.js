const path = require('path');
const methodOverride = require('method-override')
const express = require('express');
const app = express();

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

// ====================== MONGOOSE SETUP =============================

const mongoose = require('mongoose');
const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("=========== MongoDB Connection Open! ==========")
    })
    .catch(err => {
        console.log("MONGODB - ERROR: ", err)
    })

// ======================= ROUTE SETUP ============================

app.get('/', (req, res) => {
    res.redirect('/products')
})

// Return all products from the database
app.get('/products', async (req, res) => {
    // Queries to the database should be awaited, as they can take time to resolve
    const products = await Product.find({})
    res.render('products/index', { products })
})

// Get product by ID and show details
app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/details', { product })
})


// ===================================================================

app.listen(8080, () => {
    console.log("=========== Listening on port: 8080 ===========")
})