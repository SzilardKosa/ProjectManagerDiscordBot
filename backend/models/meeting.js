const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Meeting = db.model('Meeting', {
  name: String,
  date: Date,
  repeat: Number,
  groupDiscordId: String,
  _group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
});

module.exports = Meeting;
