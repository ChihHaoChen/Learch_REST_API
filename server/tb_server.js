require('./config/config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { Tb_event } = require('./models/tb_event');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// some useful comments to avoid the testing error
// Uncaught error outside test suite// Uncaught Error: listen EADDRINUSE :::3000
app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  // 1st step : check if the id is valid or not by isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  }
  else {
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        res.status(200).send({todo});
      }
    }, (err) => {
      res.status(400).send();
    });
  }
});

app.delete('/todos/:id', authenticate, (req, res) => {
  // get the id
  const id = req.params.id;
  // Validate the id -> if not valid, return 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  } else {
    // remove todo by ID
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
      if(!todo) {
        res.status(404).send();
      }
      else {
        res.status(200).send({todo});
      }
    }, (err) => {
      // error, and send status(400) and empty body
      res.status(400).send();
    });
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('The data with this ID is not available.');
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
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
    'genre',
    'date',
    'place',
    'age_suggest',
    'num_people',
    'time_duration',
    'level',
    'description'
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
  Tb_event.find().then((tb_event) => {
    res.send({ tb_event });
  }).catch((err) => {
    res.status(400).send(err);
  });
});

// The route to access the events created by a specific user
app.get('/tb_events/users/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`userId is ${userId}`);
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
    'genre',
    'date',
    'place',
    'age_suggest',
    'num_people',
    'time_duration',
    'description'
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
      console.log(`Event is not found`);
      return res.status(404).send();
    }
    res.send({tb_event});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

//if(!module.parent) {
  app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
  });
//}

module.exports = { app }; //since the module we want to export also called app
