const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const extendSchema = require('mongoose-extend-schema');

let lineUserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
    // minlength: 1,
    // trim: true,
    // default: null,
    // unique: true,
    // validate: {
    //   validator: validator.isEmail,
    //   message: '{VALUE} is not a valid email.'
    // }
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
  },
  profilePic: {
    type: String
  }
});

lineUserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  return _.omit(userObject, ['password', 'tokens']);
};

lineUserSchema.statics.findByToken = function(token) {
  let User = this;

  return User.findOne({
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

lineUserSchema.methods.removeToken = function(token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

let lineUser = mongoose.model('lineusers', lineUserSchema, 'users');

module.exports = { lineUser };
