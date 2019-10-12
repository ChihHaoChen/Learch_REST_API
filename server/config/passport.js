// load all the things we need
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LineStrategy = require('passport-line-auth').Strategy;

// load up the user model
const { facebookUser } = require('../models/facebookuser');
const { lineUser } = require('../models/lineuser')

// load the auth variables
const configAuth = require('./keys');

// The user id (you provide as the second argument of the done function) is saved in the session 
// and is later used to retrieve the whole object via the deserializeUser function.
//serializeUser determines which data of the user object should be stored in the session. 
//The result of the serializeUser method is attached to the session as req.session.passport.user = {}
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  facebookUser.findById(id, (err, user) => {
    if (user) {
      done(err, user);
    }
    else {
      lineUser.findById(id, (err, user) => {
        if (err)  {
          throw err
        }
        done(err, user);
      })
    }
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

passport.use(
new LineStrategy({
  channelID: configAuth.lineAuth.channelID,
  channelSecret: configAuth.lineAuth.channelSecret,
  callbackURL: configAuth.lineAuth.callbackURL,
  scope: ['profile', 'openid'],
  botPrompt: 'normal'
},
(token, refreshToken, profile, cb) => {
  let profileId = profile.id;
  let pictureUrl = profile.pictureUrl;
  let name = profile.displayName;
  let access = 'auth';

  lineUser.findOne({ _id: profileId }, (err, existingUser) => {
    if (err) {
      return cb(err);
    }
    if (existingUser) {
      existingUser.tokens = existingUser.tokens.concat([{ access, token }]);
      existingUser.save(err => {
        if (err)  {
          throw err;
        }
        return cb(null, existingUser);
      });
    }
    else {
      var user = new lineUser({ _id: profileId });
      user.tokens = user.tokens.concat([{ access, token }]);
      user.name = [{ firstName: "", middleName: "", lastName: "", userName: name }]
      user.profilePic = pictureUrl
      user.save(err => {
        if (err)  {
          throw err;
        }
        return cb(null, user);
      })
    }
  });
}
));
