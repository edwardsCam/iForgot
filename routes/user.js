var express = require('express'),
    User = require('../schemas/User'),
    router = express.Router();

router.get('/profile/:userId', function(req, res, next) {

    var userId = req.params.userId;
    if (!userId) res.json('Was not given a userId.');

    User.find().byId(userId).exec(function(err, userData) {
        if (err) console.error(err);
        else if (userData) res.send(userData);
    });
});

router.post('/login', function(req, res, next) {

    // var token = newUser.generateJwt();
    // res.status(200);
    // res.json({
    //     token: token
    // });

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
        newUser.setPassword(req.body.pass);
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
