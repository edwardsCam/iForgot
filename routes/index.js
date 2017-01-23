var express = require('express'),
    jwt = require('jsonwebtoken'),
    config = require('../cfg/config'),
    User = require('../schemas/User'),
    ObjectId = require('mongodb').ObjectId,
    router = express.Router();

var titleObj = { title:'Todo' };

router.get('/', function(req, res, next) {
    res.redirect('/login');
});

router.get('/login', function(req, res, next) {
    res.render('login', titleObj);
});

router.get('/register', function(req, res, next) {
    res.render('register', titleObj);
});

// login will post here, and only that post should get past the authentication middleware
router.post('/main', ensureAuthorized, function(req, res, next) {
    if (req.success === false) {
        res.redirect('/login');
        return;
    }
    res.status(200).json({});
});

// only grant access if redirected here from the login screen.
// this prevents directly accessing the '/main' url.
router.get('/main', function(req, res, next) {
    if (wasDirectedHere(req)) {
        res.render('todo', titleObj);
    } else {
        res.redirect('/login');
    }
});

// get the list of todo items for this user,
// but only if the token is authorized
router.get('/todo/:userId', ensureAuthorized, function(req, res, next) {
    if (req.success === false) {
        res.redirect('/login');
        return;
    }
    var userId = new ObjectId(req.params.userId);
    User.find().byId(userId).exec(function(err, userData) {
        if (err) console.error(err);
        if (userData) res.send(userData.todo);
    });
});

// save the list of todo items for this user,
// but only if the token is authorized
router.post('/todo/:userId', ensureAuthorized, function(req, res, next) {
    if (req.success === false) {
        res.redirect('/login');
        return;
    }
    var userId = new ObjectId(req.params.userId);
    var query = { _id:userId };
    var options = {
        $set: { todo:req.body }
    };
    User.update(query, options, function(err, userData) {
        if (err) console.log(err);
        if (userData) res.send(userData);
    });
});

// authentication middleware
function ensureAuthorized(req, res, next) {
    var authHeader = req.headers['authorization'];
    if (authHeader) {
        var token = authHeader.split(' ')[1];
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) fail();
            else next();
        });
    } else fail();
    function fail() { res.json({ success:false }) }
}

function wasDirectedHere(req) {
    return req.get('Referer') != null;
}

module.exports = router;
