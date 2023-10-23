const mongoose = require('mongoose');
const passLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    subjects: [{type: Schema.Types.ObjectId, ref: 'Subject'}],
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}]
});

UserSchema.plugin(passLocalMongoose, {usernameField: 'email'})
module.exports = mongoose.model('User', UserSchema)