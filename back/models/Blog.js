const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    name: String,
    type: String,
    photo: String,
    gender: String,
    age: Number,
    color: String,
    date: String,
    passport: Boolean,
    available: {
        type: Boolean,
        default: true
    },
    description: String,
    _User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    collection: 'blogs'
});

const Blog = model('Blog', blogSchema);
module.exports = Blog;