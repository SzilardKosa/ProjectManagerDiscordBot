/**
 * Find a meeting in the db using the :meetingID param
 * the result is saved to res.locals.meeting
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MeetingModel = requireOption(objectrepository, 'MeetingModel');

  return function (req, res, next) {
    MeetingModel.findOne({ _id: req.params.meetingID }, (err, meeting) => {
      if (err || !meeting) {
        return next(err || 'meeting not found');
      }

      res.locals.meeting = meeting;
      return next();
    });
  };
};
