
const mongoose = require('mongoose');

let Tb_event = mongoose.model('Tb_event', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    minlength: 1
  },
  date: {
    type: String,
    required: true,
    minlength: 1
  },
  place: [{
    geo_lat: {
      type: Number,
      required: true
    },
    geo_lng: {
      type: Number,
      required: true
    }
  }],
  age_suggest: [{
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    }
  }],
  num_people: {
    type: Number,
    required: true
  },
  time_duration: [{
    mins: {
      type: Number,
      required: true
    },
    hours: {
      type: Number,
      required: true
    }
  }],
  level: {
    type: String,
    required: true
  },
  description: [{
    comments: {
      type: String,
      minlength: 1
    }
  }],
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { Tb_event };
