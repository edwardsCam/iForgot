var express = require('express'),
    User = require('../schemas/User'),
    router = express.Router();

router.post('/login', function(req, res, next) {

    var userName = req.body.userName;
    User.find().byName(userName).exec(function(err, userData) {
        if (err) {
            res.status(404).json(err);
        } else if (userData && userData.validPassword(req.body.pass)) {
            var token = userData.generateJwt();
            res.status(200).json(goodResponse(token));
        } else {
            res.status(200).json(badResponse('Bad login'));
        }
    });

});

router.post('/register', function(req, res, next) {

    var userName = req.body.userName;
    User.find().byName(userName).exec(function(err, userData) {
        if (err) console.error(err);
        else if (userData) {
            res.json(badResponse('A user with that username already exists.'));
        } else {
            createUser();
        }
    });

    function createUser() {
        var newUser = new User();
        newUser.userName = userName;
        newUser.hashAndSetPassword(req.body.pass);
        newUser.save(function(err) {
            if (err) {
                console.error(err);
                return;
            }
            res.json(goodResponse(''));
        });
    }
});

function goodResponse(msg) {
    return response(true, msg);
}
function badResponse(msg) {
    return response(false, msg);
}
function response(s, m) {
    return { success:s, msg:m }
}

module.exports = router;
