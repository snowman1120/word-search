const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    word: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('words', WordSchema);
