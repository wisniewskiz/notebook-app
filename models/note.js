const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subject = require('./subject');
const User = require('./user');

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
        {type: Schema.Types.ObjectId, ref: 'User'}
    , 
    subject: 
        {type: Schema.Types.ObjectId, ref: 'Subject'}
},
{ 
    timestamps: true
});

NoteSchema.post('findOneAndDelete', async function(data) {
    const inSubject = await Subject.findById(data.subject);
    const forUser = await User.findById(data.owner);
    inSubject.notes.splice(inSubject.notes.indexOf(data._id), 1);
    forUser.notes.splice(forUser.notes.indexOf(data._id), 1);
    await inSubject.save();
    await forUser.save();
});

module.exports = mongoose.model('Note', NoteSchema);