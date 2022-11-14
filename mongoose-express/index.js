const path = require('path');
const methodOverride = require('method-override')
const express = require('express');
const app = express();
const morgan = require('morgan')
const AppError = require('./AppError')
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

// app.use(( req, res, next) => {
//     req.requestTime = Date.now()
//     console.log(req.method, req.path, )
//     return next()
// })

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
    res.status(401) // Send a 401 status code: not authorized
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
// app.use(morgan('tiny'))

// ====================== MONGOOSE SETUP =============================

const mongoose = require('mongoose');
const Product = require('./models/product');
const Farm = require('./models/farm');
// const { nextTick } = require('process');
require('dotenv').config();
const dbName = 'farmStand'

mongoose.connect(`${process.env.DB_URI}/${dbName}?retryWrites=true&w=majority`)
    .then(() => {
        console.log("=========== MongoDB Connection Open! ==========")
    })
    .catch(err => {
        console.log("MONGODB - ERROR: ", err)
    })

// ====================== OTHER SETUP =============================

const categories = ['fruit', 'vegetable', 'dairy']

// ======================= PRODUCT ROUTES ============================

app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.redirect('/products')
})

app.get('/admin', (req, res) => {
    throw new AppError(403, "You are not an Admin!")
})

// Return all products from the database
app.get('/products', asyncErrorWrapper(async (req, res) => {

    const filter = req.query.category

    // Queries to the database should be awaited, as they can take time to resolve
    let products = await Product.find({})    
    if(filter){
        products = await Product.find({category: filter})
        res.render('products/index', { products, categories, filter })
    } else {    
        res.render('products/index', { products, categories, filter: 'all' })
    }
}))

// Add a product to the database
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

// Posting a new prduct
app.post('/products', async (req, res, next) => {
    // Use try and catch to handle mongoose errors
    try {

        // Passing data directly into a new product is not safe
        // as we aren't doing any checks on the input
        const newProduct = new Product(req.body)
        await newProduct.save()
        res.redirect(`/products/${newProduct._id}`)

    } catch (error) {
        return next(error)
    }


})

// Get product by ID and show details
app.get('/products/:id', asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params
    const product = await Product.findById(id).populate('farm', 'name')
    res.render('products/details', { product })

}))

// Edit a product
app.get('/products/:id/edit', asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id)

    if(!product){
        // App errors must be called by 'next' in an async function (not 'thrown' as normal)
        return next(new AppError(404,"Product not found!"))
    }
    res.render('products/edit', { product, categories })
}))

// Updating a prduct
app.put('/products/:id', asyncErrorWrapper(async (req, res) => {

    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})

    res.redirect(`/products/${product._id}`)
}))

// Deleting a prduct
app.delete('/products/:id', asyncErrorWrapper(async (req, res) => {

    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    res.redirect(`/products`)
}))

// Secret page
app.get('/secret', verifyPassword, (req, res) => {
    res.send("<h1>You found the secret!</h1>")
})

// ======================= FARM ROUTES ============================

// Return all products from the database
app.get('/farms', asyncErrorWrapper(async (req, res) => {
    const farms = await Farm.find({})    
    res.render('farms/index', { farms })
}))

// Add a farm to the database
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

// Get farm by ID and show details
app.get('/farms/:id', asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const farm = await Farm.findById(id).populate('products')
    if(!farm){
        // App errors must be called by 'next' in an async function (not 'thrown' as normal)
        return next(new AppError(404,"Farm not found!"))
    }
    // Return the next function above to ensure the below function does not run afterwards!
    res.render('farms/details', { farm })
}))

app.get('/farms/:id/products/new', asyncErrorWrapper(async(req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    res.render('farms/newProduct', { categories, farm })
}))

// Posting a new farm
app.post('/farms', asyncErrorWrapper(async (req, res, next) => {

    // Passing data directly into a new product is not safe
    // as we aren't doing any checks on the input
    const newFarm = new Farm(req.body)
    await newFarm.save()
    res.redirect(`/farms/${newFarm._id}`)
}))

// Posting a new product to a farm
app.post('/farms/:id/products/new', asyncErrorWrapper(async(req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)

    const { name, price, category } = req.body
    const product = new Product({ name, price, category })
    farm.products.push(product)
    product.farm = farm

    await farm.save()
    await product.save()

    res.redirect(`/farms/${farm._id}`)
}))

// Edit a farm
app.get('/farms/:id/edit', asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const farm = await Farm.findById(id)

    if(!farm){
        // App errors must be called by 'next' in an async function (not 'thrown' as normal)
        return next(new AppError(404,"Farm not found!"))
    }
    res.render('farms/edit', { farm })
}))

// Updating a farm
app.put('/farms/:id', asyncErrorWrapper(async (req, res) => {

    const { id } = req.params
    const farm = await Farm.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})

    res.redirect(`/farms/${farm._id}`)
}))

// Deleting a farm
app.delete('/farms/:id', asyncErrorWrapper(async (req, res) => {

    const { id } = req.params
    const deletedFarm = await Farm.findByIdAndDelete(id)

    res.redirect(`/farms`)
}))



// ===================================================================

// If no page was found
app.use((req, res) => {
    res.status(404).send("404: NOT FOUND")
})

// ======================= PLAYING WITH ERRORS ============================

// Wrapper function that runs the input function, catching any errors and passing it onto 'next'
function asyncErrorWrapper(fn){
    return function(req, res, next){
        fn(req, res, next).catch(error => next(error))
    }
}


// This route will generate an error
app.get('/error', (req, res) => {
    chicken.fly()
})

// Handle validation errors
const handleValidationErr = err => {
    console.dir(err)
    return new AppError(400, `Validation Failed - ${err.message}`)
}

app.use((err, req, res, next) => {
    console.log(err.name) // You can single out different types of errors using .name
    if(err.name === 'ValidationError') err = handleValidationErr(err)
    next(err)
    
})



app.use((err, req, res, next) => {
    // console.log("************************************************************")
    // console.log("**********************  ERROR!  ****************************")
    // console.log("************************************************************")
    // next(err) // Calling next with an error input will launch the default express error handler
    
    // Pull the error code from the error, defaulting to 500 if none were found
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).send(`${status}: ${message}`)
})

// ===================================================================

app.listen(8080, () => {
    console.log("=========== Listening on port: 8080 ===========")
})