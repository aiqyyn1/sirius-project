const jwt = require('jsonwebtoken');
const { secretAccess } = require('../../config');

const User = require('../../model/User');

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }
    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'User is not authenticated' });
    }

    const decodedData = jwt.verify(token, secretAccess.secret);

    req.user = await User.findOne({_id:decodedData.id});

    next();
  } catch (e) {
    console.log(e);
    res.status(403).json({ message: 'User is not authenticated' });
  }
};
