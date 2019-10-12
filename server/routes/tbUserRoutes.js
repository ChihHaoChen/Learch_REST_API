const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const passport = require('passport');

const keys = require('../config/keys');
let { mongoose } = require('../db/mongoose');
let { Tb_event } = require('../models/tb_event');
let { User } = require('../models/user');
let { facebookUser } = require('../models/facebookuser');
let { lineUser } = require('../models/lineuser');
let { authenticate } = require('../middleware/authenticate');

require('../config/passport');

module.exports = app => {
  // POST/users
  app.post('/users', (req, res) => {
    let user = new User(_.pick(req.body, ['email', 'password']));

    user
      .save()
      .then(() => {
        return user.generateAuthToken();
        //res.send(user);
      })
      .then(token => {
        res.header('x-auth', token).send(user);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

  app.get('/users/me', authenticate, (req, res) => {
    // get the value by req.header with the key 'x-auth'
    res.send(req.user);
  });

  // POST /users/login(email, body) to regenerate the new token
  app.post('/users/login', (req, res) => {
    let body = new User(_.pick(req.body, ['email', 'password']));

    User.findByCredentials(body.email, body.password)
      .then(user => {
        user.generateAuthToken().then(token => {
          res.header('x-auth', token).send(user);
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  // this route is used to delete the token when users log out
  app.delete('/users/me/token', authenticate, (req, res) => {
    req.user
      .removeToken(req.token)
      .then(() => {
        res.status(200).send();
      })
      .catch(() => {
        res.status(400).send();
      });
  });

  // GET /users/auth/facebook => Facebook Sign up
  app.get(
    '/users/facebook/auth',
    passport.authenticate('facebook', {
      scope: 'email',
      session: true
    })
  );

  // GET /users/auth/facebook/callback
  app.get(
    '/users/facebook/auth/callback',
    passport.authenticate('facebook', {
      successRedirect: '/users/facebook/me',
      failureRedirect: '/users/facebook/auth'
    })
  );

  app.delete('/users/facebook/logout', authenticate, (req, res) => {
    req.user
      .removeToken(req.token)
      .then(() => {
        req.logout();
        res.status(200).send();
      })
      .catch(() => {
        res.status(400).send();
      });
  });

  app.patch('/users/profile/:id', authenticate, (req, res) => {
    const id = req.params.id;
    let user_profile_update = [
      'email',
      'password',
      'tokens',
      'gender',
      'name',
      'address',
      'title',
      'birthOfDate',
      'phone',
      'occupation',
      'rate',
      'profilePic',
      'profilePicColor'
    ];
    let body = _.pick(req.body, user_profile_update);

    if (!ObjectID.isValid(id)) {
      return res.status(400).send('User not found in database');
    }

    User.findOneAndUpdate(
      {
        _id: id
      },
      { $set: body },
      { new: true }
    )
      .then(user => {
        if (!user) {
          return res.status(404).send();
        }
        res.send({ user });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  app.get('/users/facebook/me', (req, res) => {
    const token = req.user.tokens[0].token;
    if (token) {
      res.header('x-auth', token).send(req.user);
    } else {
      res.status(400).send(`Token is not found.`);
    }
  });

  // GET /users/auth/line => LINE Sign up
  app.get(
    '/users/line/auth',
    passport.authenticate('line', {
      scope: ['profile', 'openid'],
      session: true
    })
  );

  // GET /users/auth/facebook/callback
  app.get(
    '/users/line/auth/callback',
    passport.authenticate('line', {
      successRedirect: '/users/line/me',
      failureRedirect: '/users/line/auth'
    })
  );

  app.delete('/users/line/logout', (req, res) => {
    console.log('user to be removed =>', req.user)
    req.user
      .removeToken(req.token)
      .then(() => {
        req.logout();
        res.status(200).send();
      })
      .catch(() => {
        res.status(400).send();
      });
  });

  app.get('/users/line/me', (req, res) => {
    console.log("token is", req.user.tokens[0].token);
    const token = req.user.tokens[0].token;
    if (token) {
      res.header('x-auth', token).send(req.user);
    } else {
      res.status(400).send(`Token is not found.`);
    }
  });
}
