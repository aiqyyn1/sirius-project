const { Schema, model } = require('mongoose');

const User = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, ref: 'Role' }],
  description: [{ type: String, required: true }],
  image: [{ type: String, default: true, unique: true }],
  reset: { type: String, default: '' },
});

module.exports = model('User', User);
