const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Subtask = db.model('Subtask', {
  name: String,
  deadline: Date,
  weight: Number,
  status: { type: Number, min: 0, max: 100 },
  projectName: String,
  _project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  ownerDiscordId: String,
});

module.exports = Subtask;
