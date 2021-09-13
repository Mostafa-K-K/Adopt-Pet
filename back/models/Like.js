const { Schema, model } = require('mongoose');

const LikeSchema = new Schema({
    _User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }
}, {
    collection: 'likes'
});

const Like = model('Like', LikeSchema);
module.exports = Like;