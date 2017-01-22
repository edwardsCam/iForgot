var express = require('express'),
    User = require('../schemas/User'),
    router = express.Router();

router.post('/login', function(req, res, next) {

    User.find().byName(req.body.user).exec(function(err, userData) {
        if (err) {
            res.status(404).json(err);
        } else if (userData && userData.validPassword(req.body.pass)) {
            var token = userData.generateJwt();
            res.json({
                success: true,
                token: token
            });
        } else {
            res.json({
                success: false,
                msg: 'Bad login'
            });
        }
    });

});

router.post('/register', function(req, res, next) {

    User.find().byName(req.body.user).exec(function(err, userData) {
        if (err) console.error(err);
        else if (userData) {
            res.json({
                success: false,
                msg: 'A user with that username already exists.'
            });
        } else {
            createUser();
        }
    });

    function createUser() {
        var newUser = new User();
        newUser.userName = req.body.user;
        newUser.hashAndSetPassword(req.body.pass);
        newUser.save(function(err) {
            if (err) {
                console.error(err);
                return;
            }
            res.json({
                success: true,
                msg: ''
            });
        });
    }
});

module.exports = router;
