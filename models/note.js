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
    owner: 
        [{type: Schema.Types.ObjectId, ref: 'User'}]
    , 
    subject: 
        [{type: Schema.Types.ObjectId, ref: 'Subject'}]
},
{ 
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);