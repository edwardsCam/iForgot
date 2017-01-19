var express = require('express'),
    User = require('../schemas/User'),
    router = express.Router();

router.get('/profile/:userId', function(req, res, next) {

    var userId = req.params.userId;
    if (!userId) res.json('Was not given a userId.');

    var query = {
        userId: userId
    };
    User.findOne(query, function(err, userData) {
        if (err) console.error(err);
        else if (userData) res.send(userData);
    });
});

router.post('/login', function(req, res, next) {

});

router.post('/register', function(req, res, next) {

});

module.exports = router;
