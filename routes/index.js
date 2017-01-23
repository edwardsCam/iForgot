var express = require('express'),
    jwt = require('jsonwebtoken'),
    config = require('../cfg/config'),
    User = require('../schemas/User'),
    ObjectId = require('mongodb').ObjectId,
    router = express.Router();

var titleObj = {
    title: 'I forgot'
};

// get homepage
// redirect to login
router.get('/', function(req, res, next) {
    res.redirect('/login');
});

// get login
// render login
router.get('/login', function(req, res, next) {
    res.render('login', titleObj);
});

// get register
// render register
router.get('/register', function(req, res, next) {
    res.render('register', titleObj);
});

// get main
// render todo list
router.post('/main', ensureAuthorized, function(req, res, next) {
    if (req.success === false) {
        res.redirect('/login');
        return;
    }
    res.status(200).json({});
});

router.get('/main', function(req, res, next) {
    if (wasDirectedHere(req)) {
        res.render('todo', titleObj);
    } else {
        res.redirect('/login');
    }
});

// get list of todo items for a user
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

// set the list of todo items for a user
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
