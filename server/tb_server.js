require('./config/config');
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const socketIO = require('socket.io');
const keys = require('./config/keys');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
//const port = process.env.PORT;
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

const io = socketIO(server);
app.set('socketio', io);

io.path('/chats')
require('./routes/tbUserRoutes')(app);
require('./routes/tbEventRoutes')(app);
require('./routes/uploadRoutes')(app);
require('./socket/socket')(app);


server.listen(port, () => {
  console.log(`Started up on ${port}.`);
});




module.exports = { app }; //since the module we want to export also called app
