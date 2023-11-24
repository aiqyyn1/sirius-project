const jwt = require('jsonwebtoken');
const { secretAccess } = require('../config');
const { secretRefresh } = require('../config');
const User = require('../model/User');

module.exports = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'User is not authenticated' });
    }

    const decodedData = jwt.verify(token, secretAccess.secret);
    req.user = await User.findOne(decodedData);
    next();
  } catch (e) {
    console.log(e);
    res.status(403).json({ message: 'User is not authenticated' });
  }
};
