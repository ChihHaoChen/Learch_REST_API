const nconf = require('nconf');
const mongoose = require('mongoose');


nconf.argv().env().file('keys.json');

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

let uri = `mongodb://${user}:${pass}@${host}:${port}`;

if (nconf.get('mongoDatabase')) {
  uri = `${uri}/${nconf.get('mongoDatabase')}`;
}

mongoose.Promise = global.Promise;
//mongoose.connect(uri, {useMongoClient: true});
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

module.exports = { mongoose };
