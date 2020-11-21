/**
 * Find all groups in the db to res.locals.server._id
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const GroupModel = requireOption(objectrepository, 'GroupModel');

  return function (req, res, next) {
    GroupModel.find({ _server: res.locals.server._id }, (err, groups) => {
      if (err) {
        return next(err);
      }

      return res.json(groups);
    });
  };
};
