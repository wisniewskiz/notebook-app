const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId
    }, 
    subject: {
        type: Schema.Types.ObjectId
    }
},
{ 
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);