const { Schema, model } = require('mongoose');

const requestSchema = new Schema({
    date: String,
    status: {
        type: Boolean,
        default: false
    },
    _User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }
}, {
    collection: 'requests'
});

const Request = model('Request', requestSchema);
module.exports = Request;