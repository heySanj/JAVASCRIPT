const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp')
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch(err => {
        console.log("ERROR: ", err)
    })


// A More complex schema with validation
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Cannot have a negative price'] // The second element in the array is the error message
    },
    onSale: {
        type: Boolean,
        default: false //default value of a property
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})

// ======================= INSTANCE METHODS ON THE SCHEMA ======================
// Methods attached to individual items in the database

productSchema.methods.greet = function () {
    console.log("HELLO THERE!")
    console.log(`- from ${this.name}`)
}

// Toggle the onSale boolean on the parent product
productSchema.methods.toggleSale = function () {
    this.onSale = !this.onSale
    return this.save(); // Save function can take time to finish -- so return to an async function and await it
}

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat)
    return this.save()
}

// Other method ideas --> Reduce price of product by a fraction, increment/decrement qty etc.

// This function will find an item, and then call a function on that item
const findProduct = async () => {
    const foundProduct = await Product.findOne({name: 'Mountain Bike'})
    foundProduct.greet()
    await foundProduct.toggleSale()
    await foundProduct.addCategory('Outdoors')
    console.log(foundProduct)
}


// =========================== STATIC METHODS ==============================
// Methods attached to the entire collection in the database (Do something to all items at once)

productSchema.statics.fireSale = function () {
    return this.updateMany({/* Leave this empty to update everything */}, { onSale: true, price: 0 })
}

// Start a fire sale!
Product.fireSale().then(res => console.log(res))

// INSTANTIATE PRODUCT
const Product = mongoose.model('Product', productSchema)

// // ================== Creating a new product ============================
// const bike = new Product({
//     name: 'Mountain Bike',
//     price: 599,
//     onSale: false,
//     categories: [
//         'Cycling',
//         'Mountain',
//         'Bike'
//     ]
// })

// bike.save()
//     .then(data => {
//         console.log("Item added!")
//         console.log(data)
//     })
//     .catch(err => {
//         console.log("Error: ", err)
//     })


// // ================== Updating a product ============================
// // Validations do not apply when updating an item/schema!! So remember to use runValidators!
// Product.findOneAndUpdate({name: 'Mountain Bike'}, {price: 490}, {new: true, runValidators: true})
//     .then(data => {
//         console.log("Item updated!")
//         console.log(data)
//     })
//     .catch(err => {
//         console.log("Error: ", err)
//     })