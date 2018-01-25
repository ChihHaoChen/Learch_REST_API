const env = process.env.NODE_ENV || 'development';
console.log(`env ***********${env}`);

if (env === 'development') {
  process.env.PORT = 3000;
  //process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
  process.env.MONGODB_URI = 'mongodb://chao0716:Monkland4410@ds111568.mlab.com:11568/tb_api';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
  console.log(`MongoDB Path : ${process.env.MONGODB_URI}`);
}
