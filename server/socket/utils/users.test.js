const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Discussion'
    }, {
      id: '2',
      name: 'Judy',
      room: 'React Discussion'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Discussion'
    }];
  });

  it('Should add new user', () => {
    let users =  new Users();
    let user = {
      id: '123',
      name: 'Andrew',
      room: 'The fans'
    };
    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('Should remove a user', () => {
    let userDeleteId = '1';
    let usersLeft = users.removeUser(userDeleteId);
    expect(usersLeft.id).toBe(userDeleteId);
    expect(users.users.length).toBe(2);
  });

  it('Should not remove user', () => {
    let userDeleteId = '100';
    let usersLeft = users.removeUser(userDeleteId);
    expect(usersLeft).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('Should find user', () => {
    let userId = '2';
    let userFound = users.getUser(userId);

    expect(userFound.id).toBe('2');
  });

  it('Should not find user', () => {
    let userId = '100';
    let userFound = users.getUser(userId);

    expect(userFound).toBeFalsy()
  });

  it('Should return names for specific chat room - Node Discussion', () => {
    let userList = users.getUserList('Node Discussion');

    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('Should return names for specific chat room - React Discussion', () => {
    let userList = users.getUserList('React Discussion');

    expect(userList).toEqual(['Judy']);
  });
});
