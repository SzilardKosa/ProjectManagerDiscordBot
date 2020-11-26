/**
 * Find all meetings in the db
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MeetingModel = requireOption(objectrepository, 'MeetingModel');

  return function (req, res, next) {
    MeetingModel.find({}, (err, meetings) => {
      if (err) {
        return next(err);
      }

      return res.json(meetings);
    });
  };
};
