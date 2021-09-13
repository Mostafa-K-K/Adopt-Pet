const { Schema, model } = require('mongoose');

const statutSchema = new Schema({
    dewormed: {
        type: Boolean,
        default: false
    },
    defleated: {
        type: Boolean,
        default: false
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    _Blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }
}, {
    collection: 'status'
});

const Statut = model('Statu', statutSchema);
module.exports = Statut;