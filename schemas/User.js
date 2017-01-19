var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

mongoose.set('debug', true);

var userSchema = mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    todo: [{
        desc: String
    }],
    hash: String,
    salt: String
});
userSchema.methods.setPassword = function(plaintext) {
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
        userId: this.userId,
        userName: this.userName,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'testSecret');
};

module.exports = mongoose.model('User', userSchema);
