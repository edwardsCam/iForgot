var express = require('express');
var router = express.Router();

var User = require('../schemas/userSchema');

// get homepage
// render homepage
router.get('/', function(req, res, next) {
    res.render('todo', {
        title: 'I forgot'
    });
});

// get list of todo items for a user
router.get('/todo/:userId', function(req, res, next) {

    var userId = req.params.userId;
    var query = {
        userId: userId
    };
    User.findOne(query, function(err, userData) {
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
