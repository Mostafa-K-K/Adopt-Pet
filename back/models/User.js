const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        maxLength: 50,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
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
    address: {
        type: String,
        trim: true,
        required: true
    },
    birthDate: String,
    token: String,
    role_id: {
        type: String,
        default: 'user'
    }
}, {
    collection: 'users'
});

const User = model('User', userSchema);
module.exports = User;