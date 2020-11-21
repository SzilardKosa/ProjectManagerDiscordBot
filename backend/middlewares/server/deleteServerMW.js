/**
 * Removes a server from the db, the entity used here is: res.locals.server
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (typeof res.locals.server === 'undefined') {
      return res.end();
    }

    res.locals.server.remove((err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
