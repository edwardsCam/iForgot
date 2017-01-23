var express = require('express'),
    User = require('../schemas/User'),
    router = express.Router();

// if the password hashes match, login by creating a token.
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

// if the userName does not already exist, create it.
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
    return genericResponse(true, msg);
}
function badResponse(msg) {
    return genericResponse(false, msg);
}
function genericResponse(s, m) {
    return { success:s, msg:m }
}

module.exports = router;
