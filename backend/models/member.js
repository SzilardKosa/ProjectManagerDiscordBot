const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Member = db.model('Member', {
  discordId: String,
  groupDiscordId: String,
  userName: String,
  _group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
});

module.exports = Member;
