const express = require('express');
const router = express.Router();

const Word = require('../../models/Word');

WORD_COUNT = 20;

router.post('/', async (req, res) => {
    try {
        const words = req.body.words;
        const queryData = words.map((word, index) => {
            return {word, number: index};
        });
        await Word.insertMany(queryData);
        res.send({success: true});
    } catch(err) {
        console.log(err);
        res.send({success: false});
    }
});

router.get('/', async (req, res) => {
    const totalCount = await Word.find({}).countDocuments();
    let numbers = [];
    for(let i = 0; i < WORD_COUNT; i ++) {
        const number = Math.round(Math.random() * (totalCount - 1));
        numbers.push(number);
    }

    words = await Word.find({number: numbers});
    words = words.map(word => word.word.toUpperCase());
    res.json(words);
});

router.get('/test', async (req, res) => {
    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let words = [];
    for(let i = 0; i < WORD_COUNT; i ++) {
        word = "";
        for(let j = 0; j < 5; j ++) word += alphabets[i];
        words.push(word);
    }
    res.json(words);
});

module.exports = router;