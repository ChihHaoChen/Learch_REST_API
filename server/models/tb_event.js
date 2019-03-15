
const mongoose = require('mongoose');

let EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  activityPicked: {
    type: String,
    required: true,
    minlength: 1
  },
  promptVisible: {
    type: Boolean,
    default: false
  },
  isDateFromClicked: {
    type: Boolean,
    default: false
  },
  isDateToClicked: {
    type: Boolean,
    default: false
  },
  date: [{
    dateFrom: {
      type: String,
      required: true
    },
    dateTo: {
      type: String,
      required: true
    }
  }],
  place: [{
    geo_lat: {
      type: Number,
      default: null
    },
    geo_lng: {
      type: Number,
      default: null
    }
  }],
  age_suggest: [{
    start: {
      type: Number,
      default: 18
    },
    end: {
      type: Number,
      default: 80
    }
  }],
  num_people: {
    type: Number,
    default: 0
  },
  time_duration: [{
    time: {
      type: String,
      required: true,
      default: '00:00:00'
    },
    timeFrom: {
      type: String,
      required: true,
      default: '00:00:00'
    },
    timeTo: {
      type: String,
      required: true,
      default: '00:00:00'
    }
  }],
  level: {
    type: String
  },
  description: [{
    comments: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      default: null
    }
  }],
  uri: [{
    image_uri: {
      type: String,
      default: null
    },
    video_uri: {
      type: String,
      default: null
    }
  }],
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  participants: [{
    _participantId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    _id: false
  }]
});

let Tb_event = mongoose.model('Tb_event', EventSchema);

module.exports = { Tb_event };
