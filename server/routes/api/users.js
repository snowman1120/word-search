const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

router.get('/:user', async (req, res) => {
    const account = req.params.user;
    try {
        const user = await User.findOne({ account: account });
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { account } = req.body;
        const newUser = new User({ account });
        const user = await newUser.save();
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
