const express = require('express');
const router = express.Router();
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: 'Server Error'});
    }
});

router.post('/', async (req, res) => {
    try {
        const { account, signature } = req.body;
        if( !account || !signature )
            return res
                .status(400)
                .send({ error: 'Request should have signature and publicAddress' });
        
        const user = await User.findOne( { account } );
        if(!user) 
            return res.status(401).send({
                error: `User with publicAddress ${account} is not found in database`
            });
        
        const msg = `I am signing my one-time nonce: ${user.nonce}`;
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const address = sigUtil.recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature
        });

        if (address.toLowerCase() === account.toLowerCase()) {
            user.nonce = Math.floor(Math.random() * 10000);
            await user.save();
            jwt.sign(
                {
                  user: {
                    id: user.id,
                    account
                  }
                },
                config.get('jwtSecret'),
                { expiresIn: '5h' },
                (err, token) => {
                  if (err) throw err;
                  else res.json({ token });
                }
            );
        } else {
            return res
                .status(401)
                .send({ error: 'Signature verification failed' });
        }
    } catch (err) {

    }
});

module.exports = router;
