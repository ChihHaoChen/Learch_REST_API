const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const keys = require('../config/keys');
let { mongoose } = require('../db/mongoose');
let { Tb_event } = require('../models/tb_event');
let { User } = require('../models/user');
let { facebookUser } = require('../models/facebookuser');
let { authenticate } = require('../middleware/authenticate');

module.exports = app => {
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

    tb_event
      .save()
      .then(doc => {
        res.send(doc);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  // The route to fetch all the events
  app.get('/tb_events', (req, res) => {
    Tb_event.find()
      .then(tb_events => {
        res.send({ tb_events });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  // The route to access the events created by a specific user
  app.get('/tb_events/users/:userId', (req, res) => {
    const userId = req.params.userId;
    Tb_event.find({
      _creator: userId
    })
      .then(tb_event => {
        res.send({ tb_event });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  app.get('/tb_events/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send('The data with this ID is not found');
    }
    Tb_event.findById(id)
      .then(tb_event => {
        if (!tb_event) {
          res.status(404).send();
        } else {
          res.status(200).send({ tb_event });
        }
      })
      .catch(err => {
        res.status(400).send(`Err message is ${err}`);
      });
  });

  app.delete('/tb_events/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send('The data with this ID is not found');
    }
    Tb_event.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
      .then(tb_event => {
        if (!tb_event) {
          res.status(404).send();
        } else {
          res.status(200).send({ tb_event });
        }
      })
      .catch(err => {
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

    if (!ObjectID.isValid(id)) {
      return res.status(400).send('The data with this ID is not found');
    }

    Tb_event.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      { $set: body },
      { new: true }
    )
      .then(tb_event => {
        if (!tb_event) {
          return res.status(404).send();
        }
        res.send({ tb_event });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
}
