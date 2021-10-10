const { Schema, model } = require("mongoose");

const ReportSchema = new Schema({
    description: String,
    _Reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Reported: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }
}, {
    collection: 'reports'
});

const Report = model('Report', ReportSchema);
module.exports = Report;