/**
 * Updates a meeting in the db, the id used here is: res.locals.meeting._id
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MeetingModel = requireOption(objectrepository, 'MeetingModel');

  return function (req, res, next) {
    MeetingModel.updateOne({ _id: res.locals.meeting._id }, req.body, (err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
