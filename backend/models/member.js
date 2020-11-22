const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Member = db.model('Member', {
  discordId: { type: String, unique: true },
  groupDiscordId: String,
  _group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
});

module.exports = Member;
