const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Project = db.model('Project', {
  name: { type: String, unique: true },
  deadline: Date,
  status: { type: String, enum: ['done', 'in-progress', 'abandoned'] },
  groupDiscordId: String,
  _group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
});

module.exports = Project;
