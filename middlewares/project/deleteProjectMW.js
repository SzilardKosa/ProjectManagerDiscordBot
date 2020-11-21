/**
 * Removes a project from the db, the entity used here is: res.locals.project
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (typeof res.locals.project === 'undefined') {
      return res.end();
    }

    res.locals.project.remove((err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
