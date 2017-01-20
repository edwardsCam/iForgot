var express = require('express'),
    User = require('../schemas/User'),
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
    res.send();
});

router.get('/main', function(req, res, next) {
    if (wasDirectedHere(req)) {
        res.render('todo', titleObj);
        res.sendStatus(200);
    } else next();
}, invalidAccess);

// get list of todo items for a user
router.get('/todo/:userId', ensureAuthorized, function(req, res, next) {

    var userId = parseInt(req.params.userId);
    User.find().byId(userId).exec(function(err, userData) {
        if (err) console.error(err);
        if (userData) res.send(userData.todo);
    });

});

// set the list of todo items for a user
router.post('/todo/:userId', ensureAuthorized, function(req, res, next) {

    var userId = parseInt(req.params.userId);
    var query = {
        userId: userId
    };
    var options = {
        $set: {
            todo: req.body
        }
    };

    User.update(query, options, function(err, userData) {
        if (err) console.log(err);
        if (userData) res.send(userData);
    });

});

function ensureAuthorized(req, res, next) {
    var token = req.body.token || req.headers['authorization'];
    if (token) {
        next();
    } else {
        res.sendStatus(401);
    }
}

function invalidAccess(req, res, next) {
    res.sendStatus(401);
    console.log('you lose, good day sir');
}

function wasDirectedHere(req) {
    return req.get('Referer') != null;
}

module.exports = router;
