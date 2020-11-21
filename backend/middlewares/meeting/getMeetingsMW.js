/**
 * Find all meetings in the db to res.locals.group._id
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MeetingModel = requireOption(objectrepository, 'MeetingModel');

  return function (req, res, next) {
    MeetingModel.find({ _group: res.locals.group._id }, (err, meetings) => {
      if (err) {
        return next(err);
      }

      return res.json(meetings);
    });
  };
};
