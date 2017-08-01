const {ObjectID} = require('mongodb');
const chai = require('chai');
const spies = require('chai-spies');
const request = require('supertest');
chai.use(spies)
const expect = chai.expect;

const {app} = require('./../server');
const {Pick} = require('./../models/pick');
const {User} = require('./../models/user');
const {picks, populatePicks, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populatePicks);


describe('POST /pick', () => {
  it('should create a new pick', (done) => {
    var championPicks = [0,1,2,3,4,5,6,7,8,9];

    request(app)
    .post('/pick')
    .set('x-auth', users[0].tokens[0].token)
    .send({championPicks})
    .expect(200)
    .expect((res) => {
      expect(res.body.championPicks).to.deep.equal(championPicks);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      Pick.find({championPicks}).then((picks) => {
        expect(picks.length).to.equal(1);
        expect(picks[0].championPicks).to.deep.equal(championPicks);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create todo with invalid body data', (done) => {
    var championPicks = 'yo';
    request(app)
    .post('/pick')
    .set('x-auth', users[0].tokens[0].token)
    .send(championPicks)
    .expect(400)
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      Pick.find().then((picks) => {
        expect(picks.length).to.equal(2);
        done();
      }).catch((e) => done(e));
    })
  })
});

describe('GET /pick', () => {
  it('should get all picks', (done) => {
    request(app)
    .get('/pick')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.picks.length).to.equal(1);
    })
    .end(done);
  });
});
//
//
// describe('GET /todos/:id', () => {
//   it('should return todo doc', (done) => {
//     request(app)
//     .get(`/todos/${todos[0]._id.toHexString()}`)
//     .set('x-auth', users[0].tokens[0].token)
//     .expect(200)
//     .expect((res) => {
//       expect(res.body.todo.text).to.equal(todos[0].text);
//     })
//     .end(done);
//   });
//
//   it('should not return todo doc created by other user', (done) => {
//     request(app)
//     .get(`/todos/${todos[1]._id.toHexString()}`)
//     .set('x-auth', users[0].tokens[0].token)
//     .expect(404)
//     .end(done);
//   });
//
//   it('should return 404 if todo not found', (done) => {
//     //make sure to get a 404 back
//     request(app)
//     .get(`todos/${new ObjectID().toHexString()}`)
//     .set('x-auth', users[0].tokens[0].token)
//     .expect(404)
//     .end(done);
//   });
//
//   it('should return 404 for non-object ids', (done) => {
//     // /todos/123
//     request(app)
//     .get('/todos/123')
//     .set('x-auth', users[0].tokens[0].token)
//     .expect(404)
//     .end(done);
//   });
//
// });
//
// describe('DELETE /todos/:id', () => {
//   it('should remove a todo', (done) => {
//     var hexId = todos[1]._id.toHexString();
//
//     request(app)
//     .delete(`/todos/${hexId}`)
//     .set('x-auth', users[1].tokens[0].token)
//     .expect(200)
//     .expect((res) => {
//       expect(res.body.todo._id).to.equal(hexId);
//     })
//     .end((err, res) => {
//       if(err){
//         return done(err);
//       }
//       Todo.findById(hexId).then((todo) => {
//         expect(todo).to.not.exist;
//         done();
//       }).catch((e) => done(e));
//     });
//   });
//
//   it('should remove a todo', (done) => {
//     var hexId = todos[0]._id.toHexString();
//
//     request(app)
//     .delete(`/todos/${hexId}`)
//     .set('x-auth', users[1].tokens[0].token)
//     .expect(404)
//     .end((err, res) => {
//       if(err){
//         return done(err);
//       }
//       Todo.findById(hexId).then((todo) => {
//         expect(todo).to.exist;
//         done();
//       }).catch((e) => done(e));
//     });
//   });
//
//   it('should return 404 if todo not found', (done) => {
//     var hexId = new ObjectID().toHexString();
//
//     request(app)
//     .delete(`/todos/${hexId}`)
//     .set('x-auth', users[1].tokens[0].token)
//     .expect(404)
//     .end(done);
//   });
//
//   it('should return 404 if object id is invalid', (done) => {
//     request(app)
//     .delete('/todos/123')
//     .set('x-auth', users[1].tokens[0].token)
//     .expect(404)
//     .end(done);
//   });
// });
//
//
// describe('PATCH /todo/:id', () => {
//   it('should update the todo', (done) => {
//     var hexId = todos[0]._id.toHexString();
//     var text = 'this is the changed text';
//     request(app)
//     .patch(`/todos/${hexId}`)
//     .set('x-auth', users[0].tokens[0].token)
//     .send({
//       completed: true,
//       text
//     })
//     .expect(200)
//     .expect((res) => {
//       expect(res.body.todo.text).to.equal(text);
//       expect(res.body.todo.completed).to.equal(true);
//       expect(res.body.todo.completedAt).to.be.a('number');
//     })
//     .end(done);
//   });
//
//   it('should not update the todo created by other user', (done) => {
//     var hexId = todos[0]._id.toHexString();
//     var text = 'this is the changed text';
//     request(app)
//     .patch(`/todos/${hexId}`)
//     .set('x-auth', users[1].tokens[0].token)
//     .send({
//       completed: true,
//       text
//     })
//     .expect(404)
//     .end(done);
//   });
//
//   it('should clear completedAt when todo is not completed', (done) => {
//     var hexId = todos[1]._id.toHexString();
//     var text = 'this is the changed text';
//     request(app)
//     .patch(`/todos/${hexId}`)
//     .set('x-auth', users[1].tokens[0].token)
//     .send({
//       completed: false,
//       text
//     })
//     .expect(200)
//     .expect((res) => {
//       expect(res.body.todo.text).to.equal(text);
//       expect(res.body.todo.completed).to.equal(false);
//       expect(res.body.todo.completedAt).to.equal(null);
//     })
//     .end(done);
//   });
// });


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).to.equal(users[0]._id.toHexString());
      expect(res.body.username).to.equal(users[0].username);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).to.deep.equal({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var username = 'example';
    var password = '123mnb!';

    request(app)
    .post('/users')
    .send({username, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).to.exist;
      expect(res.body.username).to.equal(username);
    })
    .end((err) => {
      if(err) {
        return done(err);
      }

      User.findOne({username}).then((user) => {
        expect(user).to.exist;
        expect(user.password).to.not.equal(username);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request invalid', (done) => {
    var username = {};
    var password = 12314123;

    request(app)
    .post('/users')
    .send({username, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if username in use', (done) => {

    request(app)
    .post('/users')
    .send({
      username: users[0].username,
      password: '123abcasd'
    })
    .expect(400)
    .end(done)
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      username: users[1].username,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).to.exist;
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).to.include({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      username: users[1].username,
      password: 12314
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).to.not.exist;
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).to.equal(1);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).to.equal(0);
        done();
      }).catch((e) => done(e));
    });

  });
});
