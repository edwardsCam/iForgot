var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    config = require('../cfg/config'),
    TodoItem = require('./TodoItem');

//mongoose.set('debug', true);

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
    return this.hash === crypto.pbkdf2Sync(plaintext, this.salt, 1000, 64).toString('hex');
};
userSchema.methods.generateJwt = function() {
    var payload = {
        userId: this._id,
        userName: this.userName
    };
    return jwt.sign(payload, config.secret, {
        expiresIn: 300 // 5 minutes
    });
};

userSchema.query.byName = function(name) {
    return this.findOne({ userName:name });
}
userSchema.query.byId = function(id) {
    return this.findOne({ _id:id });
}

module.exports = mongoose.model('User', userSchema);
