var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    config = require('../cfg/config'),
    TodoItem = require('./TodoItem');

mongoose.set('debug', true);

var userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    todo: [TodoItem.schema],
    hash: String,
    salt: String
});

userSchema.methods.hashAndSetPassword = function(plaintext) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(plaintext, this.salt, 1000, 64).toString('hex');
};
userSchema.methods.validPassword = function(plaintext) {
    var hash = crypto.pbkdf2Sync(plaintext, this.salt, 1000, 64).toString('hex');
    return hash === this.hash;
};
userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        userId: this._id,
        userName: this.userName,
        exp: parseInt(expiry.getTime() / 1000)
    }, config.secret);
};

userSchema.query.byName = function(name) {
    return this.findOne({
        userName: name
    });
}
userSchema.query.byId = function(id) {
    return this.findOne({
        _id: id
    });
}

module.exports = mongoose.model('User', userSchema);
