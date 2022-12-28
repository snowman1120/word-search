const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();

// Init Middleware
app.use(express.json());
app.use(cors({origin: '*'}));

const data = fs.readFileSync('word/5000.txt', {encoding:'utf8', flag:'r'});
 
let words = data.split('\n');
words = words.map(word => {
    word = word.split(' ')[0];
    return word.trim();
});

words = words.filter(word => word.length > 2);

const putWords = async () => {
    const res = await axios.post('http://localhost/api/word', {words});

    if(res.data.success) {
        console.log('Successfully!!!');
    } else {
        console.log('Error');
    }
}
putWords();