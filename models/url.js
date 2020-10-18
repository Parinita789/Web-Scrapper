
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Url = new Schema({
    id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    params: {
        type: Array,
        default: []
    },
    is_visited: {
        type: Boolean,
        default: false,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Url', Url);