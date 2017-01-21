var mongoose = require('mongoose');

var todoItemSchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('TodoItem', todoItemSchema);
