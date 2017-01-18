var express = require('express');
var router = express.Router();

// get homepage
// render homepage
router.get('/', function(req, res, next) {
    res.render('todo', {
        title: 'I forgot'
    });
});

// get list of todo items for a user
router.get('/todo/:id', function(req, res, next) {

    var userId = parseInt(req.params.id);
    req.db.get('userlist').findOne({
        userId: userId
    }, {}).then((resp) => {
        res.json(resp.todo);
    });

});

// set the list of todo items for a user
router.post('/todo/:id', function(req, res, next) {

    var userId = parseInt(req.params.id);
    var query = {
        userId: userId
    };
    var update = {
        $set: {
            todo: req.body
        }
    };
    var options = {
        new: true,
        upsert: true
    };
    req.db.get('userlist').findOneAndUpdate(query, update, options, function(err, doc) {
        console.log(doc);
        res.json(doc);
    });
});

module.exports = router;
