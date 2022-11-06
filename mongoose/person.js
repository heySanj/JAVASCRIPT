const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp')
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch(err => {
        console.log("ERROR: ", err)
    })

const personSchema = new mongoose.Schema({
    first: String,
    last: String
})

// Create a virtual element that will combine the first and last name into a fullname
personSchema.virtual('fullName').get(function () {
    return `${this.first} ${this.last}`
}).
set(function(v) { // The setter can be used like so: person.fullName = 'new name'
    this.first = v.substr(0, v.indexOf(' '));
    this.last = v.substr(v.indexOf(' ') + 1);
    return this.save()
})

// ====================== MIDDLEWARE ========================

// Run this code before something --> use next or return a promise
// to make sure that something runs after this code
personSchema.pre('save', async function () {
    this.first = 'YO'
    this.last = 'MAMA'
    console.log("----- I'M ABOUT TO SAVE! -----")
})

// This code runs after the save function
personSchema.post('save', async function () {
    console.log("----- JUST SAVED! -----")
})

const Person = mongoose.model('Person', personSchema)