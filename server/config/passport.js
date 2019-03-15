// load all the things we need
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
const { facebookUser } = require('../models/facebookuser');

// load the auth variables
const configAuth = require('./keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  facebookUser.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      // pull in our app id and secret from our auth.js file
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: configAuth.facebookAuth.profileFields
    },
    (token, refreshToken, profile, done) => {
      let email = profile.emails[0].value;
      let access = 'auth';

      // find the user in the database based on their facebook id
      facebookUser.findOne({ email: email }, function(err, existingUser) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
          return done(err);
        }
        // if the user is found, then log them in
        if (existingUser) {
          existingUser.tokens = existingUser.tokens.concat([{ access, token }]);
          existingUser.save(err => {
            if (err) {
              throw err;
            }
            return done(null, existingUser); // user found, return that user
          });
        } else {
          // if there is no user found with that facebook id, create them
          var user = new facebookUser({ email: email });
          // set all of the facebook information in our user model
          user.tokens = user.tokens.concat([{ access, token }]);

          //console.log(user);
          user.save(err => {
            if (err) {
              throw err;
            }
            return done(null, user);
          });
        }
      });
    }
  )
);
