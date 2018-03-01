<!-- [![Image caption](/project.logo.jpg)](#) -->

# PROJECT

## TrainingBuddy API

### The API implementation for TrainingBuddy APP

**[INSTALL][i] | [FLOWCHART][f] | [USAGE][u] | [Database][d] | [AUTHOR][auth] | [CONTRIBUTE][cpl] | [LICENSE][cpl] | [SUPPORT][ps]**

## MOTIVATION

This private repository is used to develope the back-end for the TrainingBudday APP.

## GETTING STARTED

[gt]: #getting-started 'Getting started guide'

The codes have been migrated from Heroku to DigitalOcean, and can be accessed through the HTTP address:

[http://159.203.33.255:3000](http//159.203.33.255:3000), where 3000 is the default port number for this API.

In the following usage guide, the keyword **_url_** will be referred to this HTTP address.
Currently there are three models implemented in this back-end development:

* _users_,
* _facebookusers_,
* _tb_events_.

All models support _CRUB_ operations with **_Express_** and **_MongoDB_**.
The difference between _users_ and _facebookusers_ is the field of password,
since facebook login does not need users' passwords.

Routes about users:

* POST /users
* GET /users/me
* DELETE /users/me/token
* POST /users/login
* PATCH /user/profile/:userId

Routes about facebookusers:

* GET /users/facebook/auth
* GET /users/me
* DELETE /users/facebook/logout
* PATCH /users/profile/:userId

Routes about tb_events:

* POST /tb_events
* GET /tb_events
* GET /tb_events/:id
* GET /tb_events/users/:userId
* DELETE /tb_events/:id
* PATCH /tb_events/:id

Public routes can be invokded without tokens, while private ones require tokens to execute the operations.
Therefore, users can check the tb_events created by other users, but they can only delete and update their own tb_events.
All tb_events will be created with users' token as one of the key value.

Regarding the security of users' data, all passwords that users provided will be hashed before being stored in our database. In current stage, the authentication only allows new users to sign up with their **email/password**. There are some other tasks are on-going for TrainingBuddy APP.

* [x] Integration of Facebook authentication.
* [ ] To upload pictures or videos of users/tb_events.
* [ ] Other features may also be supported in the future.

### INSTALLATION

[i]: #install 'The required libraries'

All the required libraries can be found in package.json.

```
npm install
```

### USAGE

[u]: #usage 'Product usage'

* POST /users => To allow new users to sign up.

```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "159.203.33.255:3000"
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

* GET /users/me => This route can be used to fetch user profiles, and supports both models of _user_ and _facebookusers_ if token x-auth is provided in the header.

```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "159.203.33.255:3000"
  ],
  "path": [
    "users",
    "me"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg4YmFmMDc3Yzk1YTY5OGI5ZjFhNWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE4OTExNjA5fQ.KCYOqMQu4jLCWnGkWahxegpJ-0UZt6q-LCtURPKquak"
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

* DELETE /users/me/token => This **private** route allows users to log out, and to delete the tokens attached to the users.

```
var http = require("http");

var options = {
  "method": "DELETE",
  "hostname": [
    "159.203.33.255:3000"
  ],
  "path": [
    "users",
    "me",
    "token"
  ],
  "headers": {
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg4YmFmMDc3Yzk1YTY5OGI5ZjFhNWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE4OTExNjA5fQ.KCYOqMQu4jLCWnGkWahxegpJ-0UZt6q-LCtURPKquak"
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

* POST /users/login => To allow a user who has signed on before to log on, and to give him/her a new token for private routes.

```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "159.203.33.255:3000"
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

* PATCH /user/profile/:userId => This **private** routes allow users to update their profiles, and supports both the models of _users_ and _facebookusers_.

```
var http = require("http");

var options = {
  "method": "PATCH",
  "hostname": [
    "{{url}}"
  ],
  "path": [
    "users",
    "profile",
    "{{userId}}"
  ],
  "headers": {
    "Content-Type": "application/json",
    "x-auth": "{{x-auth}}"
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

req.write(JSON.stringify({ gender: 'female',
  name:
   [ { firstName: 'Catherine',
       middleName: 'MiddleName',
       lastName: 'Kate',
       userName: 'CK' } ],
  address:
   [ { street: 'Monkland 4410',
       city: 'Montreal',
       province: 'Quebec',
       state: 'NA',
       country: 'Canada',
       postCode: 'H4B 2S9' } ],
  title: 'Mrs.',
  birthOfDate: [ { year: '1971', month: 'Jan', date: '10' } ],
  phone: '514-872-8588',
  occupation: 'Trainer',
  rate: 4 }));
req.end();
```

* GET /users/facebook/auth => This route will bring Facebook authentication page.
  A callback route will be triggered after successfully log in their profiles. In the meantime, this callback route will be redirected to another route to send x-auth token in the header, which can be used to access other **private** routes offered in this API.

* DELETE /users/facebook/logout => This route will log users out, and remove the token stored in database. Strongly recommended to be executed when users have no activities in session in addition to the common log-out function.

```
var http = require("http");

var options = {
  "method": "DELETE",
  "hostname": [
    "{{url}}"
  ],
  "path": [
    "users",
    "facebook",
    "logout"
  ],
  "headers": {
    "x-auth": "EAAIFJPAxW3wBAK2cMBj7VrzZAJrPDyij547w9KXe2VHl6uzjRXXyV5m0svVgDvPtn7Nb20zKMlfZBZAbDRwtEZBDxOZBrhZAlomHJ7Llj9aU0IWKfepAbOM9ipw6ObIF5bMRq3aSZB5vgdVDTQakBbTSdbrOxDnEIPkosdE5d0pqnAeb8f3ke3T"
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

* POST /tb_events => This **private** route allows a user to post tb_events.

```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "159.203.33.255:3000"
  ],
  "path": [
    "tb_events"
  ],
  "headers": {
    "Content-Type": "application/json",
    "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg4YmFmMDc3Yzk1YTY5OGI5ZjFhNWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE4OTExNjA5fQ.KCYOqMQu4jLCWnGkWahxegpJ-0UZt6q-LCtURPKquak"
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

* GET /tb_events => This route allows users to see all available tb_events.

```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "159.203.33.255:3000"
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

* GET /tb_events/users/:userId => This **private** route allows users to fetch tb_events posted by a specific user according to his/her userID.

```
var http = require("http");

var options = {
 "method": "GET",
 "hostname": [
   "159.203.33.255:3000"
 ],
 "path": [
   "tb_events",
   "users",
   "5a88b9f277c95a698b9f1a50"
 ],
 "headers": {
   "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg4YmFmMDc3Yzk1YTY5OGI5ZjFhNWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE4OTExNjA5fQ.KCYOqMQu4jLCWnGkWahxegpJ-0UZt6q-LCtURPKquak"
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

* DELETE /tb_events/:id => This **private** route gives users to delete tb_events they posted.

```
var http = require("http");

var options = {
 "method": "DELETE",
 "hostname": [
   "159.203.33.255:3000"
 ],
 "path": [
   "tb_events",
   "5a88bd9177c95a698b9f1a78"
 ],
 "headers": {
   "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg4YmFmMDc3Yzk1YTY5OGI5ZjFhNWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE4OTExNjA5fQ.KCYOqMQu4jLCWnGkWahxegpJ-0UZt6q-LCtURPKquak"
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

All the requests can also be found in [POSTMAN Documentation](https://documenter.getpostman.com/view/3019646/tb_api/7TT8VDJ#error-codes). In addition, a [test file](https://github.com/ChihHaoChen/tb_api/blob/master/server/tests/tb_server.test.js) has been uploaded to run self-test, which will be helpful about how to send reqeusts and fetch responses through this API.

## Database

[d]: #database 'Module\'s API description'
The database employed in this back-end API is installed in DigitalOcean, a platform of Database-as-a-Service for MongoDB.
The database can be accessed through [Robo3T](https://robomongo.org/) with the SSH connect to your local terminal.

## AUTHOR

[auth]: #author 'Credits & author\'s contacts info '
You can just [email](chao700716@gmail.com) me.

## ACKNOWLEDGMENTS

[acc]: acknowledgments

List of people and project that inspired creation of this one:

* Github guides for their precious [documenting your project](https://guides.github.com/features/wikis/#creating-a-readme) article concerning readme creation
  
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
