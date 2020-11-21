/**
 * Find a group in the db using the :groupID param
 * the result is saved to res.locals.group
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const GroupModel = requireOption(objectrepository, 'GroupModel');

  return function (req, res, next) {
    GroupModel.findOne({ discordId: req.params.groupID }, (err, group) => {
      if (err || !group) {
        return next(err || 'group not found');
      }

      res.locals.group = group;
      return next();
    });
  };
};
