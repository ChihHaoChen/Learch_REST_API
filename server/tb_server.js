require('./config/config');
//const passport = require('passport-facebook');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

const keys = require('./config/keys');
let { mongoose } = require('./db/mongoose');
let { Tb_event } = require('./models/tb_event');
let { User } = require('./models/user');
let { facebookUser } = require('./models/facebookuser');
let { authenticate } = require('./middleware/authenticate');
require('./config/passport');



const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/tbUserRoutes')(app);
require('./routes/tbEventRoutes')(app);
//if(!module.parent) {
app.listen(port, () => {
  console.log(`Started up at port ${port}.`);
});


module.exports = { app }; //since the module we want to export also called app
