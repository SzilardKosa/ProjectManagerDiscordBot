/**
 * Removes a group from the db, the entity used here is: res.locals.group
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (typeof res.locals.group === 'undefined') {
      return res.end();
    }

    res.locals.group.remove((err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
