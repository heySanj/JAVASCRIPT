const mongoose = require('mongoose')
const Product = require('./product')
const { Schema } = mongoose

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, "Farm must have a name"]
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email required"]
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})

// Middleware for deleting Farms and their associated products if using 'findbyIDandDelete'
// Using post findOneAndDelete as that is the only time 'farm' is available
// (farm doesn't exist before the findOneAndDelete function call)
farmSchema.post('findOneAndDelete', async function (farm){

    // Check to see if there are any products that belong to this farm
    if(farm.products.length){

        // Delete all Products whose ID is $in the farm.products array
        const res = await Product.deleteMany({ _id: {$in: farm.products }})
        console.log(res)
    }
})

const Farm = mongoose.model('Farm', farmSchema)

// Export the Farm model to the main app
module.exports = Farm