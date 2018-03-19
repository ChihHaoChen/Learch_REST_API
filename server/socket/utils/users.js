
class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id)  {
    let user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    // we have to find out what users are in specific chat room
    let users = this.users.filter((user) => user.room === room);
    // if user.room === room, then return true
    let namesArray = users.map((user) => user.name);

    return namesArray;
  }
};


module.exports = { Users };
