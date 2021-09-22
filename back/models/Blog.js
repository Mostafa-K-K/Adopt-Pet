const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    name: String,
    animal: String,
    kind: String,
    photo: String,
    gender: String,
    age: Number,
    color: String,
    description: String,
    date: String,
    available: {
        type: Boolean,
        default: true
    },
    _User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    collection: 'blogs'
});

const Blog = model('Blog', blogSchema);
module.exports = Blog;