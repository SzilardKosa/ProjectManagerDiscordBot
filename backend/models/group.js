const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Group = db.model('Group', {
  discordId: { type: String, unique: true },
  serverDiscordId: String,
  _server: {
    type: Schema.Types.ObjectId,
    ref: 'Server',
  },
});

module.exports = Group;
