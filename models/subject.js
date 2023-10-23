const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    notes: [{
        type: Schema.Types.ObjectId, ref: 'Note'
    }],
    owner: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
});

module.exports = mongoose.model('Subject', SubjectSchema)