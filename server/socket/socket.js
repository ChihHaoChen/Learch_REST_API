const path = require('path');
const http = require('http');
const express = require('express');
const { ObjectID } = require('mongodb');
//const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
let { Tb_event } = require('../models/tb_event');
let { User } = require('../models/user');
let { authenticate } = require('../middleware/authenticate');


//const io = socketIO(server);
let users = new Users();
let tb_event_participated = new Tb_event;

module.exports = (app, io) => {
  //let chatRoute = express.Router();
  //chatRoute.use('/', (req, res) => {
  app.get('/chats/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
    console.log(`Event id is ${id}`);
    console.log(`User id is ${userId}`);
    if (!ObjectID.isValid(id)) {
      return res.status(400).send('The event with this ID is not found.');
    }

    try {
      tb_event = await Tb_event.aggregate([{ "$match" : { "$and": [
        { "_id": ObjectID(id) },
        { "participants": { "$in": [{ "_participantId": ObjectID(userId)}]}}
      ]}}]);

      if (typeof tb_event[0] === "null" || typeof tb_event[0] === "undefined") {
        res.status(400).send(`You have not participated the event.`);
      }
      else {
        tb_event_participated = tb_event;

        chatConnection(io, tb_event_participated,req);

        res.status(200).send({ tb_event_participated });
      }

    } catch(e) {
      res.status(400).send(`No event with this event ID.`);
    }
  });

  function chatConnection(io, tb_event, req) {
    const id = req.params.id;
    const userId = req.user._id;
    console.log(`Connected!`);
    io.on('connection', socket => {
      console.log(`Welcome to ${tb_event[0].name}`);
      // Listener of 'join' @ Server
      socket.on('join', (callback) => {
        socket.join(id);
        users.removeUser(socket.id) // to have users left from previous chat rooms
        users.addUser(socket.id, userId, id); // add user to the new room
        console.log(`From database, socket_id is ${socket.id}, name is ${userId}, room is ${id}`);
        io.to(id).emit('updateUserList', users.getUserList(id));

        socket.emit(
          'newMessage',
          generateMessage('Admin', `Welcome to the event of ${id}`)
        );

        socket.broadcast.to(id).emit(
          'newMessage',
          generateMessage('Admin', `${userId} has joined`)
        );
        callback();
      });
      // Listener of 'createMessage' @ Server
      socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
          console.log(`User is ${user.name} in socket.id ${socket.id}`);
          const counter = io.sockets.clients(socket.room).length;
          console.log(`Counter number is ${counter}`);
        }
        callback();
      });
      // Listener of 'disconnect' @ Server
      socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if (user) {
          io.to(user.room).emit('updateUserList', users.getUserList(user.room));

          io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
      });
    });
  };
};
