const jwt = require('jsonwebtoken');

const { secretAccess } = require('../../config')
const { secretRefresh } = require('../../config');
const User = require('../../model/User');

module.exports = async function (req, res, next) {
  try {
    const accessToken = req.cookies.access;
    const refreshToken = req.cookies.refresh;
    if (!accessToken && refreshToken) {
      const decodedData1 = jwt.verify(refreshToken, secretRefresh.secret);
      req.user = User.find({ _id: decodedData1.id });
    } else if (accessToken && !refreshToken) {
      const decodedData = jwt.verify(accessToken, secretAccess.secret);
      req.user = User.find({ _id: decodedData.id });
    } else {
      const decodedData = jwt.verify(accessToken, secretAccess.secret);
      req.user = User.find({ _id: decodedData.id });
    }
    next();
  } catch (e) {
    return res.send(500).send({ message: 'Internal server error' });
  }
};
