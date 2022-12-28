const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get metaAccount from header
  const metaAccount = req.header('x-auth-token');

  // Check if not token
  if (!metaAccount) {
    return res.status(401).json({ msg: 'No metamask account, authorization denied' });
  }

  // Verify metaAccount
  try {
    jwt.verify(metaAccount, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.log(err)
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};
