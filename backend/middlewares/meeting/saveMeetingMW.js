/**
 * Saves a meeting in the db
 * returns the result as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MeetingModel = requireOption(objectrepository, 'MeetingModel');

  return function (req, res, next) {
    if (
      typeof req.body.name === 'undefined' ||
      typeof req.body.date === 'undefined' ||
      typeof req.body.repeat === 'undefined'
    ) {
      return next('one or more field is undefined');
    }

    let meeting = new MeetingModel();
    meeting.name = req.body.name;
    meeting.date = new Date(req.body.date);
    meeting.repeat = req.body.repeat;
    meeting._group = res.locals.group._id;
    meeting.groupDiscordId = res.locals.group.discordId;

    meeting.save((err, newMeeting) => {
      if (err || !newMeeting) {
        return next(err || 'newMeeting not found');
      }

      return res.json(newMeeting);
    });
  };
};
