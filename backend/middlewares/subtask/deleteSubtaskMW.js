/**
 * Removes a subtask from the db, the entity used here is: res.locals.subtask
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (typeof res.locals.subtask === 'undefined') {
      return res.end();
    }

    res.locals.subtask.remove((err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
