const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: "Farm"
    }
})

const Product = mongoose.model('Product', productSchema)

// Export the Product model to the main app
module.exports = Product