<!-- [![Image caption](/project.logo.jpg)](#) -->

# PROJECT
## TrainingBuddy API
### The API implementation for TrainingBuddy APP

**[INSTALL][i] | [USAGE][u] | [Database][d] | [AUTHOR][auth] | [CONTRIBUTE][cpl] | [LICENSE][cpl] | [SUPPORT][ps]**

## MOTIVATION
This private repository is used to develope the back-end for the TrainingBudday APP.

## GETTING STARTED
[gt]: #getting-started 'Getting started guide'

The codes have been uploaded to Heroku, and can be accessed through the HTTP address:

[https://secret-tor-77277.herokuapp.com](https://secret-tor-77277.herokuapp.com).

In the following usage guide, the keyword **_url_** will be referred to this HTTP address.
Currently there are two models implemented in this back-end development: _users_ and _tb_events_. Both models support *CRUB* operations with **_Express_** and **_MongoDB_**.

Routes about users:
- POST /users
- GET /users/me
- DELETE /users/me/token
- POST /users/login

Routes about tb_events:
- POST /tb_events
- GET /tb_events
- GET /tb_events/:id
- GET /tb_events/users/:userId
- DELETE /tb_events/:id
- PATCH /tb_events/:id

Public routes can be invokded without tokens, while private ones require tokens to execute the operations. 
Therefore, users can check the tb_events created by other users, but they can only delete and update their own tb_events.
All tb_events will be created with users' token as one of the key value. 

Regarding the security of users' data, all passwords that users provided will be hashed before being stored in our database. In current stage, the authentication only allows new users to sign up with their **email/password**. There are some other tasks are on-going for TrainingBuddy APP.

- [ ] Integration of Facebook authentication.
- [ ] To upload pictures or videos of users/tb_events.
- [ ] Other features may also be supported in the future.

### INSTALLATION
[i]: #install 'The required libraries' 
All the required libraries can be found in package.json.
```
npm install
```

### USAGE
[u]: #usage 'Product usage'

- POST /users => To allow new users to sign up.
```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "users"
  ],
  "headers": {
    "Content-Type": "application/json"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ email: 'chao0716_8@gmail.com', password: 'test123' }));
req.end();
```
- GET /users/me => This route can be used to fetch users' tokens.
```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "users",
    "me"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
```
- DELETE /users/me/token => This **private** route allows users to log out, and to delete the tokens attached to the users.
```
var http = require("http");

var options = {
  "method": "DELETE",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "users",
    "me",
    "token"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
```
- POST /users/login => To allow a user who has signed on before to log on, and to give him/her a new token for private routes. 
```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "users",
    "login"
  ],
  "headers": {
    "Content-Type": "application/json"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ email: 'chao0716_111@gmail.com', password: 'test123' }));
req.end();
```
- POST /tb_events => This **private** route allows a user to post tb_events.
```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "tb_events"
  ],
  "headers": {
    "Content-Type": "application/json",
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ name: 'Body Building',
  activityPicked: 'Training',
  date: [ { dateFrom: '2018-02-01', dateTo: '2018-03-01' } ],
  place: [ { geo_lat: 20, geo_lng: 50 } ],
  age_suggest: [ { start: 18, end: 50 } ],
  num_people: 80,
  time_duration: [ { time: '02:00:00', timeFrom: '18:00:00', timeTo: '20:00:00' } ],
  level: 'beginner',
  description: [ { comments: 'For muscles', rating: 4.7 } ] }));
req.end();
```
- GET /tb_events => This route allows users to see all available tb_events.
```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "tb_events",
    ""
  ],
  "headers": {}
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
```
- GET /tb_events/:id => This route allows users to fetch a specific tb_event based on their event ID.
```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "tb_events",
    "5a77ab39c8a317001446428f"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
```
 - GET /tb_events/users/:userId => This **private** route allows users to fetch tb_events posted by a specific user according to his/her userID.
 ```
 var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "tb_events",
    "users",
    "5a771ea0599d18031aec6a76"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
 ```
 - DELETE /tb_events/:id => This **private** route gives users to delete tb_events they posted.
 ```
 var http = require("http");

var options = {
  "method": "DELETE",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "tb_events",
    "5a77ab39c8a317001446428f"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
 ```
 - PATCH /tb_events/:id => This **private** route allows users to update the tb_events they created before according to the event ID.
 ```
var http = require("http");

var options = {
  "method": "PATCH",
  "hostname": [
    "https://secret-tor-77277.herokuapp.com"
  ],
  "path": [
    "tb_events",
    "5a77ab39c8a317001446428f"
  ],
  "headers": {
    "Content-Type": "application/json",
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3YWIzM2M4YTMxNzAwMTQ0NjQyOGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE3NzkyMDUxfQ.XHZwndCewdx1iDy-Ww7nxN73qRlKB_cekv5f2F-3xp4"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ name: 'body building - advanced level course.',
  genre: 'Training',
  date: '2018-02-28',
  place: [ { geo_lat: 50, geo_lng: 50 } ],
  age_suggest: [ { start: 18, end: 60 } ],
  num_people: 20,
  time_duration: [ { mins: 30, hours: 1 } ],
  description: [ { comments: 'For totally beginners.' } ] }));
req.end();
 ```
 
 All the requests can also be found in [POSTMAN Documentation](https://documenter.getpostman.com/view/3019646/tb_api/7TT8VDJ#error-codes).
## Database
[d]: #database 'Module\'s API description'
The database employed in this back-end API is mLab, a platform of Database-as-a-Service for MongoDB. 
Currently, all the users/tb_events data is stored in [ds125058.mlab.com], and can be accessed through [Robo3T](https://robomongo.org/) the account/password, and port number shown below.

![Optional Text](images/Heroku_api_setting1.png)
![Optional Text](images/Heroku_api_setting2.png)
#### WARNING!:   
Api description should be given here.
```
Code examples ...
```

## AUTHOR
[auth]: #author 'Credits & author\'s contacts info '
You can just [email](chao700716@gmail.com) me.

## ACKNOWLEDGMENTS
[acc]: acknowledgments

List of people and project that inspired creation of this one:


- Github guides for their precious [documenting your project](https://guides.github.com/features/wikis/#creating-a-readme) article concerning readme creation
## CONTRIBUTION & LICENSE
[cpl]:#contribution--license 'Contribution guide & license info'

Check out (if any) <a href='/CONTRIBUTION'>contribution guide</a> or <a href='/LICENSE'>license</a> for more details.

## PRODUCTION STATUS & SUPPORT
[ps]: #production-status--support 'Production use disclaimer & support info'

You should be aware that this project is supported solely by me and provided as is.
<br>If you want to become a **patron** or offer me a **support** please [follow here][auth].

<hr>

Go back to the **[project description][d]**

Copyright © 2017 Davronov Alexander 