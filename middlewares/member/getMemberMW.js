/**
 * Find a memeber in the db using the :memberID param
 * the result is saved to res.locals.member
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MemberModel = requireOption(objectrepository, 'MemberModel');

  return function (req, res, next) {
    MemberModel.findOne({ discordId: req.params.memberID }, (err, member) => {
      if (err || !member) {
        return next(err || 'member not found');
      }

      res.locals.member = member;
      return next();
    });
  };
};
