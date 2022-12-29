const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Play = require('../../models/Play');

router.get('/', async (req, res) => {
    try {
        const plays = await Play.aggregate([
            {
                $addFields: {
                    trackTime: {
                        $function: {
                            body: function (start, end) {
                                return new Date(end).getTime() - new Date(start).getTime();
                            },
                            args: ["$start", "$end"],
                            lang: 'js'
                        }
                    }
                }
            },
            {
                $match: { trackTime : { $gt: 0 } }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { trackTime: 1 }
            }
        ]);
        res.json(plays);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

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