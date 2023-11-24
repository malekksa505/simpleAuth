const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank.']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank.']
    }
});

userSchema.statics.findAndValidate = async function(username,password) {
    const foundUser = await this.findOne({ username });
    const isValid = bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

userSchema.pre('save', async function(next) {
    //
    //if(!this.isModified('password')) return next(); // for refresh the idea of the code come back to 517 lesson in 11:00
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;