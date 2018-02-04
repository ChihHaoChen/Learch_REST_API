
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('underscore');

const { app } = require('./../tb_server');
const { User } = require('./../models/user');
const { Tb_event } = require('./../models/tb_event');

const { users,
        populateUsers,
        tb_events,
        populateTb_events
} = require('./seed/seed');

// beforeEach is used to initiate the test database.
beforeEach(populateUsers);
beforeEach(populateTb_events);

describe('POST /tb_events', () => {
  it('should create a new tb_event', (done) => {
    let test_event = {
      name: 'test event from server.test.js',
      activityPicked: 'test genre',
      date: [{
        dateFrom: '2018-01-01',
        dateTo: '2018-12-31'
      }],
      time_duration: [{
        time: '24:00:00',
        timeFrom: '08:00:00',
        timeTo: '08:00:00'
      }]
    };

    request(app)
      .post('/tb_events')
      .set('x-auth', users[0].tokens[0].token)
      .send(test_event)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(test_event.name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Tb_event.find({name:'test event from server.test.js' }).then((tb_events) => {
          expect(tb_events.length).toBe(1);
          expect(tb_events[0].name).toBe(test_event.name);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create any tb_event with invalid body data', (done) => {
    request(app)
      .post('/tb_events')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Tb_event.find().then((tb_events) => {
          expect(tb_events.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /tb_events', () => {
  it('Should get all tb_events', (done) => {
    request(app)
      .get('/tb_events')
      // .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.tb_events.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /tb_events/:id', () => {
  it('Should return tb_event according to the event ID', (done) => {
    request(app)
      .get(`/tb_events/${tb_events[0]._id.toHexString()}`)
      // .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.tb_event.name).toBe(tb_events[0].name);
      })
      .end(done);
  });

  it('Should return the tb_event according to the event ID created by other users', (done) => {
    request(app)
      .get(`/tb_events/${tb_events[1]._id.toHexString()}`)
      // .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.tb_event.name).toBe(tb_events[1].name);
      })
      .end(done);
  });

  it('Should return 404 if tb_event no found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/tb_events/${hexId}`)
      // .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {

    request(app)
      .get('/tb_events/1234abcd')
      // .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /tb_events/:id', () => {
  it('Should remove a tb_event', (done) => {
    var hexId = tb_events[1]._id.toHexString();

    request(app)
      .delete(`/tb_events/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.tb_event._id).toBe(hexId);
      })
      .end((err, res) => {
        //query database using findById toNotExist
        if (err) {
          return done(err);
        }
        Tb_event.findById(hexId).then((tb_event) => {
          expect(tb_event).toBeFalsy(); // change toNotExist -> toBeNull, or toBeFalsy
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not remove a tb event created by other user', (done) => {
    var hexId = tb_events[0]._id.toHexString();

    request(app)
      .delete(`/tb_events/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Tb_event.findById(hexId).then((tb_event) => {
          expect(tb_event).toBeTruthy(); // change toNotExist -> toBeNull, or toBeFalsy
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if tb_event not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/tb_events/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if tb_event id is invalid', (done) => {
    request(app)
      .get('/tb_events/1234abcd')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /tb_events/:id', () => {
  it('Should update the tb_event', (done) => {
    // grab the id of the first item
    let hexId = tb_events[0]._id.toHexString();
    let update_event = {
      name: 'update event from server.test.js',
      activityPicked: 'update genre',
      date: [{
        dateFrom: '2018-03-03',
        dateTo: '2018-09-03'
      }],
      time_duration: [{
        time: '12:00:00',
        timeFrom: '08:00:00',
        timeTo: '20:00:00'
      }]
    };

    request(app)
      .patch(`/tb_events/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(update_event) // Use ES6
    //200
      .expect(200)
      .expect((res) => {
        expect(res.body.tb_event._id).toBe(hexId);
        expect(res.body.tb_event.name).toBe(update_event.name);
        expect(res.body.tb_event.activityPicked).toBe(update_event.activityPicked);
        expect(res.body.tb_event.date[0].dateFrom).
          toBe(update_event.date[0].dateFrom);
        expect(res.body.tb_event.date[0].dateTo).
          toBe(update_event.date[0].dateTo);
        expect(res.body.tb_event.time_duration[0].time).
          toBe(update_event.time_duration[0].time);
        expect(res.body.tb_event.time_duration[0].timeFrom).
          toBe(update_event.time_duration[0].timeFrom);
        expect(res.body.tb_event.time_duration[0].timeTo).
          toBe(update_event.time_duration[0].timeTo);
      })
      .end(done);
    });

    it('Should not update the tb_event created by other users', (done) => {
      // grab the id of the first item
      let hexId = tb_events[0]._id.toHexString();

      let update_event_user1 = {
        name: 'update event from server.test.js',
        activityPicked: 'update genre',
        date: [{
          dateFrom: '2018-03-03',
          dateTo: '2018-09-03'
        }],
        time_duration: [{
          time: '12:00:00',
          timeFrom: '08:00:00',
          timeTo: '20:00:00'
        }]
      };

      request(app)
        .patch(`/tb_events/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(update_event_user1) // Use ES6
      //404
        .expect(404)
        .end(done);
      });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should creat a user', (done) => {
    let email = 'example@example.com';
    let password = '123mnb';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return validation errors if request invallid', (done) => {
    let email = 'examplecom';
    let password = '123';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('Should not create user if email in use', (done) => {
    let email = 'andrew@example.com';
    let password = 'userOnePass';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'Test for Invalid Login'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', (done) => {
    request(app)
    // DELETE /users/me/tokens
      .delete('/users/me/token')
    // set x-ath equal to tokens
      .set('x-auth', users[0].tokens[0].token)
    //200
      .expect(200)
      // .expect((res) => {
      //   expect(res.headers['x-auth']).toBeTruthy();
      // })
    // Find user, verify that tokens array has length of zero
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  });

});
