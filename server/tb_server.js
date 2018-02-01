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

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// some useful comments to avoid the testing error
// Uncaught error outside test suite// Uncaught Error: listen EADDRINUSE :::3000
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  // 1st step : check if the id is valid or not by isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  }
  else {
    Todo.findById(id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        // res.status(200).send(JSON.stringify(todo, undefined, 2));
        res.status(200).send({todo});
      }
    }, (err) => {
      res.status(400).send();
    });
  }
});

app.delete('/todos/:id', (req, res) => {
  // get the id
  const id = req.params.id;
  // Validate the id -> if not valid, return 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not available.');
  } else {
    // remove todo by ID
    Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch('/todos/:id', (req, res) => {
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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

//if(!module.parent) {
  app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
  });
//}

// POST/Events
app.post('/tb_events', (req, res) => {
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

  let tb_event = new Tb_event(_.pick(req.body, event_input));
  console.log(tb_event);
  tb_event.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/tb_events', (req, res) => {
  Tb_event.find().then((tb_event) => {
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

app.delete('/tb_events/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('The data with this ID is not found');
  }
  Tb_event.findByIdAndRemove(id).then((tb_event) => {
    if(!tb_event) {
      res.status(404).send();
    } else {
      res.status(200).send({ tb_event });
    }
  }).catch((err) => {
    res.status(400).send();
  });
});

app.patch('/tb_events/:id', (req, res) => {
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

  Tb_event.findByIdAndUpdate(id, { $set: body }, { new: true }).then((tb_event) => {
    if(!tb_event) {
      console.log(`Event is not found`);
      return res.status(404).send();
    }
    res.send({tb_event});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

module.exports = { app }; //since the module we want to export also called app
