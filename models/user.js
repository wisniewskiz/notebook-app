const mongoose = require('mongoose');
const passLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    subjects: [{type: Schema.Types.ObjectId, ref: 'Subjects'}],
    notes: [{type: Schema.Types.ObjectId, ref: 'Notes'}]
});

UserSchema.plugin(passLocalMongoose, {usernameField: 'email'})
module.exports = mongoose.model('User', UserSchema)