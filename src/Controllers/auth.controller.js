const User = require('../../model/User');
const Role = require('../../model/Role');
const bcrypt = require('bcryptjs');
const { model } = require('mongoose');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../../config');
const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '7h' });
};
const Registration = async (req, res) => {
  try {
    const { username, password, email, re_password } = req.body;
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
    const hashPassword = bcrypt.hashSync(password, 7);
    const userRole = await Role.findOne({ value: 'USER' });
    const user = new User({
      username,
      email,
      password: hashPassword,
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
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: `Пользователь по имени ${username} не найден` });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password is not correct' });
    }
    const token = generateAccessToken(user.id, user.roles);
    res.cookie('access', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 60 * 60 * 1000,
    });
    res.cookie('refresh', token, {
      httpOnly: true,
      secure: true,
      maxAge: 12 * 60 * 60 * 1000,
    });
    return res.json({ message: 'Succesfully login' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Login error' });
  }
};
const getUser = async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    console.log(e);
  }
};

const refresh = (req, res) => {
  const refreshToken = req.headers.authorization.split(' ')[1];

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decodedData = jwt.verify(refreshToken, secret);

    if (decodedData) {
      const { id, roles } = decodedData;
      const newAccessToken = jwt.sign({ id, roles }, secret, {
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

module.exports = { Registration, Login, getUser, refresh };
