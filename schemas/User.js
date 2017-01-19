var mongoose = require('mongoose');
mongoose.set('debug', true);

module.exports = mongoose.model('User', mongoose.Schema({
    userId: Number,
    userName: String,
    todo: [{ desc:String }],
    hash: String,
    salt: String
}), 'User');
