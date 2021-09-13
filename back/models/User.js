const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        maxLength: 50,
        required: true
    },
    password: String,
    phoneNumber: {
        type: String,
        trim: true,
        maxLength: 20,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    birthDate: String,
    photo: String,
    token: String
}, {
    collection: 'users'
});

const User = model('User', userSchema);
module.exports = User;