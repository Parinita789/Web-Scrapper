
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Param = new Schema({
    id: {
        type: String,
        required: true
    },
    keyword: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Param', Param);