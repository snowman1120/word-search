const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Play = require('../../models/Play');

router.post('/start', auth, async (req, res) => {
    try {
        const newPlay = new Play({
            user: req.user.id,
            start: new Date().getTime()
        });
        const play = await newPlay.save();
        res.json(play);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/end', auth, async (req, res) => {
    try {
        let play = await Play.findOne({_id: req.body.id});
        if(!play) {
            return res.status(401).json({message: 'Something went wrong.'})
        }
        play.end = new Date().getTime();
        play = await play.save();
        res.json(play);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;