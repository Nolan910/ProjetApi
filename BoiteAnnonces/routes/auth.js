const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

//inscription
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(401).json({ message: 'Email déjà utilisé' });
      }

      const newUser = new User({ firstName, lastName, email, password });
      return newUser.save();
    })
    .then(user => {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Utilisateur créé avec succès', user });
    });
});

// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Authentification réussie', user: req.user });
});

module.exports = router;
