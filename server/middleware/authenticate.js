let { User } = require('./../models/user');
let { facebookUser } = require('./../models/facebookuser');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token)
    .then(user => {
      if (!user) {
        // res.status(401).send();
        return Promise.reject(); // a better approach compared to the above line
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      facebookUser
        .findByToken(token)
        .then(user => {
          if (!user) {
            return Promise.reject();
          }
          req.user = user;
          req.token = token;
          next();
        })
        .catch(eFB => {
          res.status(401).send();
        });
    });
};

module.exports = { authenticate };
