/**
 * Removes a member from the db, the entity used here is: res.locals.member
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (typeof res.locals.member === 'undefined') {
      return res.end();
    }

    res.locals.member.remove((err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
