const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const extendSchema = require('mongoose-extend-schema');

let facebookUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: null,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ],
  gender: {
    type: String
  },
  name: [
    {
      firstName: {
        type: String
      },
      middleName: {
        type: String
      },
      lastName: {
        type: String
      },
      userName: {
        type: String
      }
    }
  ],
  address: [
    {
      street: {
        type: String
      },
      city: {
        type: String
      },
      province: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      postCode: {
        type: String
      }
    }
  ],
  birthOfDate: [
    {
      year: {
        type: String
      },
      month: {
        type: String
      },
      date: {
        type: String
      }
    }
  ],
  title: {
    type: String
  },
  phone: {
    type: String
  },
  occupation: {
    type: String
  },
  rate: {
    type: Number
  }
});

facebookUserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  // return _.pick(userObject, ['_id', 'email']);
  return _.omit(userObject, ['password', 'tokens']);
};

facebookUserSchema.statics.findByToken = function(token) {
  let User = this;
  // let decoded;
  //
  // try {
  //   decoded = jwt.verify(token, process.env.JWT_SECRET);
  // } catch (e) {
  //   return Promise.reject();
  // }

  return User.findOne({
    // _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

facebookUserSchema.methods.removeToken = function(token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

let facebookUser = mongoose.model('facebookusers', facebookUserSchema, 'users');

module.exports = { facebookUser };
