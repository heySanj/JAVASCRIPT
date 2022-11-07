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

// ====================== OTHER SETUP =============================

const categories = ['fruit', 'vegetable', 'dairy']

// ======================= ROUTE SETUP ============================

app.get('/', (req, res) => {
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


// ===================================================================

app.listen(8080, () => {
    console.log("=========== Listening on port: 8080 ===========")
})