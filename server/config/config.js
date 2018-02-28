const env = process.env.NODE_ENV || 'development';
console.log(`env ***********${env}`);

if (env === 'development' || env === 'test') {
  let config = require('./config.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
  //process.env.MONGODB_URI = 'mongodb://chao0716:Monkland4410@ds111568.mlab.com:11568/tb_api';
}
