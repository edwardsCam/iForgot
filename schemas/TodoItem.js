var mongoose = require('mongoose');

var todoItemSchema = mongoose.Schema({
    desc: String
});

module.exports = mongoose.model('TodoItem', todoItemSchema);
