/**
 * Removes a meeting from the db, the entity used here is: res.locals.meeting
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (typeof res.locals.meeting === 'undefined') {
      return res.end();
    }

    res.locals.meeting.remove((err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
