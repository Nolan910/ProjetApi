const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  oauthProvider: String,
  oauthId: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
