
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../tb_server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { Tb_event } = require('./../models/tb_event');

const { todos,
        populateTodos,
        users,
        populateUsers
} = require('./seed/seed');

// beforeEach is used to initiate the test database.
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should not return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if todo no found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {

    request(app)
      .get('/todos/1234abcd')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        //query database using findById toNotExist
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy(); // change toNotExist -> toBeNull, or toBeFalsy
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not remove a todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        //query database using findById toNotExist
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy(); // change toNotExist -> toBeNull, or toBeFalsy
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .get('/todos/1234abcd')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    // grab the id of the first item
    let hexId = todos[0]._id.toHexString();
    // update text, set completed true
    let text = 'Text to be updated for test';
    let completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text, completed }) // Use ES6
    //200
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
        // expect(res.body.todo.text).toBe(text);
      })
      // text is changed, completed is true, completed is a number, toBeA
      .end(done);
    });

    it('Should not update the todo created by other users', (done) => {
      // grab the id of the first item
      let hexId = todos[0]._id.toHexString();
      // update text, set completed true
      let text = 'Text to be updated for test';
      let completed = true;

      request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({ text, completed }) // Use ES6
      //404
        .expect(404)
        .end(done);
      });

    it('Should clear completedAt when todo is not completed', (done) => {
      // grab the id of second todo item
      let hexId = todos[1]._id.toHexString();
      // update the text, set completed to false
      let text = 'Change the state of completed from True to False';
      let completed = false;

      request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({ text, completed }) // Use ES6
      //200
        .expect(200)
      // text is changed, completed false, completedAt is null .toNotExist
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeFalsy();
        })
      // text is changed, completed is true, completed is a number, toBeA
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
