const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/movieApp')
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch(err => {
        console.log("ERROR: ", err)
    })


// Create a new Schema which a model/collection will use
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
})

// Create a model --> Which will be returned as a class 'Movie'
// This in the database will be a collection of 'movies'
const Movie = mongoose.model('Movie', movieSchema)

// Instantiate a new Movie object -- This will not automatically be saved into the database!
// This only exists as an object in Javascript (not on the database)
// To save to the database, call the .save() function on it.
// const amadeus = new Movie({ title: "Amadeus", year: 1986, score: 9.2, rating: "R" })

// amadeus.save() // Save it in the database
//// ============== INSERTING WITH MONGOOSE ========================
// Movie.insertMany([
//     { title: "Amelie", year: 2001, score: 8.3, rating: "R" },
//     { title: "Alien", year: 1979, score: 8.1, rating: "R" },
//     { title: "The Iron Giant", year: 1999, score: 7.5, rating: "PG" },
//     { title: "Stand By Me", year: 1986, score: 8.6, rating: "R" },
//     { title: "Moonrise Kingdom", year: 2012, score: 7.3, rating: "PG-13" }
// ])


// // ============== FINDING WITH MONGOOSE ========================
// // Find will return a promise-like object (thenable object)
// // Use the .then() function to read the output data
// Movie.find({year: {$lt: 2010}}).then(data => console.log(data))

// // ================ UPDATING WITH MONGOOSE ========================
// // Movie.update() will update and return a result saying if the update was successful
// Movie.updateOne({title: "Amadeus"}, {year: 1984}).then(result => console.log(result))
// Movie.updateMany({title: {$in: ['Amadeus', 'Stand By Me']}}, {score: 10}).then(result => console.log(result))

// // findOneAndUpdate() will update and then return the updated model object if {new: true}
// Movie.findOneAndUpdate({title: "The Iron Giant"}, {score: 7.8}, {new: true}).then(m => console.log(m))

// // ==================== DELETING WITH MONGOOSE ======================
// Movie.remove({title: 'Amelie'}).then(msg => console.log(msg))
// Movie.deleteMany({year: {$gte: 1999}}).then(msg => console.log(msg))

// // Delete 'Alien' and return the model/object
// Movie.findOneAndDelete({title: 'Alien'}).then(m => console.log(m))