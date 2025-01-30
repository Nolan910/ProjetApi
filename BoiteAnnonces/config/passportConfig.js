const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/User');
const jwt = require('jsonwebtoken');


// google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    // Si l'utilisateur existe, on l'utilise, sinon on le crée
    User.findOne({
            oauthId: profile.id,
            oauthProvider: 'google'
        })
        .then(user => {
            if (user) {
                return done(null, user);
            }
            const newUser = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                oauthProvider: 'google',
                oauthId: profile.id
            });
            return newUser.save();
        })
        .then(user => done(null, user));
}));



// github
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/github/callback'
}, (token, tokenSecret, profile, done) => {
    // Si l'utilisateur existe, on l'utilise, sinon on le crée
    User.findOne({
            oauthId: profile.id,
            oauthProvider: 'github'
        })
        .then(user => {
            if (user) {
                return done(null, user);
            }
            const newUser = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                oauthProvider: 'github',
                oauthId: profile.id
            });
            return newUser.save();
        })
        .then(user => done(null, user));
}));



module.exports = passport;