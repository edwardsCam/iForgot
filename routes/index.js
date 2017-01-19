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
router.get('/main', function(req, res, next) {
    res.render('todo', titleObj);
});

// get list of todo items for a user
router.get('/todo/:userId', function(req, res, next) {

    var userId = req.params.userId;
    User.find().byId(userId).exec(function(err, userData) {
        if (err) console.error(err);
        if (userData) res.send(userData.todo);
    });

});

// set the list of todo items for a user
router.post('/todo/:userId', function(req, res, next) {

    var userId = req.params.userId;
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

module.exports = router;
