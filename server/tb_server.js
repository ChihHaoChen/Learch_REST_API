
require('./config/config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Tb_event } = require('./models/tb_event');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.send(`The connection to DigitalOcean is okay.`);
});

// POST/users
app.post('/users', (req, res) => {
  let user = new User(_.pick(req.body, ['email', 'password']));
  user.save().then(() => {
    return user.generateAuthToken();
    //res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// GET/users/me
app.get('/users/me', authenticate, (req, res) => {
  // get the value by req.header with the key 'x-auth'
  res.send(req.user);
});

// POST /users/login(email, body) to regenerate the new token
app.post('/users/login', (req, res) => {
  let body = new User(_.pick(req.body, ['email', 'password']));

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// this route is used to delete the token when users log out
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch(() => {
    res.status(400).send();
  });

});

// POST/Events
app.post('/tb_events', authenticate, (req, res) => {
  let event_input = [
    'name',
    'activityPicked',
    'promptVisible',
    'isDateFromClicked',
    'isDateToClicked',
    'date',
    'place',
    'age_suggest',
    'num_people',
    'time_duration',
    'level',
    'description',
    'uri'
  ];
  let pickObj = _.pick(req.body, event_input);
  let creator = { _creator: req.user._id };

  let tb_event = new Tb_event(Object.assign(pickObj, creator));

  tb_event.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

// The route to fetch all the events
app.get('/tb_events', (req, res) => {
  Tb_event.find().then((tb_events) => {
    res.send({ tb_events });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

// The route to access the events created by a specific user
app.get('/tb_events/users/:userId', (req, res) => {
  const userId = req.params.userId;
  Tb_event.find({
    _creator: userId
  }).then((tb_event) => {
    res.send({ tb_event });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/tb_events/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not found');
  }
  Tb_event.findById(id).then((tb_event) => {
    if(!tb_event) {
      res.status(404).send();
    } else {
      res.status(200).send({ tb_event });
    }
  }).catch((err) => {
    res.status(400).send(`Err message is ${err}`);
  });
});

app.delete('/tb_events/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not found');
  }
  Tb_event.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((tb_event) => {
    if(!tb_event) {
      res.status(404).send();
    } else {
      res.status(200).send({ tb_event });
    }
  }).catch((err) => {
    res.status(400).send();
  });
});

app.patch('/tb_events/:id', authenticate, (req, res) => {
  const id = req.params.id;

  let event_input_update = [
    'name',
    'activityPicked',
    'promptVisible',
    'isDateFromClicked',
    'isDateToClicked',
    'date',
    'place',
    'age_suggest',
    'num_people',
    'time_duration',
    'level',
    'description',
    'uri'
  ];
  let body = _.pick(req.body, event_input_update);

  if(!ObjectID.isValid(id)) {
    return res.status(400).send('The data with this ID is not found');
  }

  Tb_event.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, { $set: body }, { new: true }).then((tb_event) => {
    if(!tb_event) {
      return res.status(404).send();
    }
    res.send({tb_event});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

  app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
  });

module.exports = { app }; //since the module we want to export also called app
