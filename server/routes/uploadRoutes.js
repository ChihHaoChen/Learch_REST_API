const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const { authenticate } = require('../middleware/authenticate');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: 'v4',
  region: ''
});

module.exports = app => {
  app.get('/api/images/upload', authenticate, (req, res) => {
    const key = `${req.user.id}/${uuid()}.png`;
    s3.getSignedUrl('putObject', {
      Bucket: 'training-buddy-bucket',
      //ContentEncoding: 'base64',
      ContentType: 'image/png',
      Key: key
    }, (err, url) => {
      res.send({ key, url });
    })
  });
};
