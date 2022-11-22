const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
})

// Statics allows you to create methods for this model (Will be applied to every user instance)
userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    if(foundUser){
        const isValid = await bcrypt.compare(password, foundUser.password);
        return isValid ? foundUser : false; // If isValid is true then return foundUser, otherwise return false
    }
    return false; // Return false if no user is found
}

// Hash the password before the User details are saved to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only has the password if the password has been modified (Otherwise the password will be hashed any time other user details are updated)
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema);