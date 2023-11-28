const User = require('../../model/User');
const Role = require('../../model/Role');
const bcrypt = require('bcryptjs');
const { model } = require('mongoose');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const { secretAccess } = require('../../config');
const { secretRefresh } = require('../../config');
const { secretReset } = require('../../config');
const mailService = require('../../mail-service');

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, secretAccess.secret, { expiresIn: '7h' });
};

const generateRefreshToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, secretRefresh.secret, { expiresIn: '12h' });
};

const Registration = async (req, res) => {
  try {
    const { username, password, email, re_password, description } = req.body;
    const image = req.file.path
    const candidate = await User.findOne({ username });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Errors in registration',
        errors: errors.array(),
      });
    }

    if (candidate) {
      return res.status(400).json({ message: 'User is already exists' });
    }
    if (password !== re_password) {
      return res.status(400).json({ message: 'Passwordos does not match' });
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const userRole = await Role.findOne({ value: 'USER' });
    const user = new User({
      username,
      email,
      password:hashPassword,
      image,
      description,
      roles: [userRole.value],
    });
    await user.save();
    return res.json({ message: 'User is succesfully registired' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(username);
    if (!user) {
      return res
        .status(400)
        .json({ message: `Пользователь по имени ${username} не найден` });
    }
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password is not correct' });
    }
    const accessToken = generateAccessToken(user.id, user.roles);
    const refreshToken = generateRefreshToken(user.id, user.roles);

    setCookie(res, 'access', accessToken, 7);
    setCookie(res, 'refresh', refreshToken, 12);

    return res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      id: user._id,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Login error' });
  }
};

const getUser = async (req, res) => {
  try {
    res.send(req.body);
  } catch (e) {
    console.log(e);
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.headers.authorization.split(' ')[1];
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decodedData = jwt.verify(refreshToken, secretRefresh.secret);

    if (decodedData) {
      const { id, roles } = decodedData;
      const newAccessToken = jwt.sign({ id, roles }, secretAccess.secret, {
        expiresIn: '7h',
      });

      return res.json({ accessToken: newAccessToken });
    } else {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('access');
    res.clearCookie('refresh');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid ' });
  }
};

const resetSend = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const token = jwt.sign({ user }, secretReset.secret, { expiresIn: '20m' });
    await mailService.sendResetMail(
      email,
      `https://sirius-sdu.vercel.app/auth/reset/${token}`
    );

    user.reset = token;
    user.save();
    return res.status(200).json({ message: 'Reset link has send' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Reset password failed' });
  }
};

const resetChange = async (req, res) => {
  try {
    const resetLink = req.params.link;
    const { newPassword } = req.body;
    if (resetLink) {
      jwt.verify(
        resetLink,
        secretReset.secret,
        async function (err, decodedData) {
          if (err) {
            console.log(err);
            return res
              .status(401)
              .json({ message: 'Invalid token or it is expired' });
          }

          const user = await User.findOne({ reset: resetLink });
          if (!user) {
            return res
              .status(401)
              .json({ message: 'User with this reset token does not exist' });
          }

          const hashPassword = await bcrypt.hash(newPassword, 7);
          user.reset = '';
          user.password = hashPassword;
          await user.save();
          return res
            .status(200)
            .json({ message: 'Password was successfully changed' });
        }
      );
    } else {
      return res.status(400).json({ message: 'Invalid link' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ messagr: 'Something went wrong' });
  }
};

const setCookie = (res, name, token, time) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: true,
    maxAge: time * 60 * 60 * 1000,
  });
};

module.exports = {
  Registration,
  Login,
  getUser,
  refresh,
  logout,
  resetSend,
  resetChange,
};
