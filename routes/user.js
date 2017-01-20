var express = require('express'),
    User = require('../schemas/User'),
    router = express.Router();

router.post('/login', function(req, res, next) {

    User.find().byName(req.body.user).exec(function(err, userData) {
        if (err) {
            res.status(404).json(err);
            return;
        }
        if (userData && userData.validPassword(req.body.pass)) {
            var token = userData.generateJwt();
            res.status(200);
            res.json({
                token: token,
                userId: userData._id
            });
        } else {
            res.status(404).json('Bad login');
            return;
        }
    });

});

router.post('/register', function(req, res, next) {

    User.find().byName(req.body.user).exec(function(err, userData) {
        if (err) console.error(err);
        else if (userData) {
            res.status(409);
            res.send('A user with that username already exists.');
        } else {
            createUser();
        }
    });

    function createUser() {
        var newUser = new User();
        newUser.userName = req.body.user;
        newUser.hashAndSetPassword(req.body.pass);
        newUser.save(function(err, userData) {
            if (err) {
                console.error(err);
                return;
            }
            res.json(userData);
        });
    }
});

module.exports = router;
