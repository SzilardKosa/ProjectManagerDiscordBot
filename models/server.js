const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Server = db.model('Server', {
  discordId: String,
});

module.exports = Server;
