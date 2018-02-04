
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { User } = require('./../../models/user');
const { Tb_event } = require('./../../models/tb_event')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id : userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id : userTwoId,
  email: 'chao0716@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const tb_events = [{
  _creator: userOneId,
  _id: new ObjectID(),
  name: 'the first test tb_event',
  activityPicked: 'the 1st test genre',
  date: {
    dateFrom: '2018-01-15',
    dateTo: '2018-02-15'
  },
  place: {
    geo_lat: 55,
    geo_lng: 65
  },
  age_suggest: {
    start: 18,
    end: 30
  },
  num_people: 20,
  time_duration: {
    time: '01:30:00',
    timeFrom: '18:30:00',
    timeTo: '20:00:00'
  },
  level: 'beginner',
  description: {
    comments: 'Tutorial event',
    rating: 4.5
  },
  uri: {
    image_uri: null,
    video_uri: null
  }
}, {
  _creator: userTwoId,
  _id: new ObjectID(),
  name: 'the second test tb_event',
  activityPicked: 'the 2nd test genre',
  date: {
    dateFrom: '2018-03-15',
    dateTo: '2018-04-15'
  },
  place: {
    geo_lat: 50,
    geo_lng: 60
  },
  age_suggest: {
    start: 20,
    end: 40
  },
  num_people: 20,
  time_duration: {
    time: '02:00:00',
    timeFrom: '18:00:00',
    timeTo: '20:00:00'
  },
  level: 'Intermediate',
  description: {
    comments: 'Event Test',
    rating: 4.9
  },
  uri: {
    image_uri: null,
    video_uri: null
  }
}]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

const populateTb_events = (done) => {
  Tb_event.remove({}).then(() => {
    return Tb_event.insertMany(tb_events);
  }).then(() => done());
};

module.exports = { users, populateUsers,
                   tb_events, populateTb_events};
