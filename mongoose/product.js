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