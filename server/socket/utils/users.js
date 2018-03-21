
class Users {
  constructor () {
    this.users = [];
  }

  addUser (socketId, userId, userName, room) {
    let user = { socketId, userId, userName, room };
    this.users.push(user);
    return user;
  }

  removeUser(id)  {
    let user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.socketId !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.socketId === id)[0];
  }

  getUserList(room) {
    // we have to find out what users are in specific chat room
    let users = this.users.filter((user) => user.room === room);
    // if user.room === room, then return true
    let namesArray = users.map((user) => user.userName);

    return namesArray;
  }
};


module.exports = { Users };
