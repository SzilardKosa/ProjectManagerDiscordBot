/**
 * Find all members in the db
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MemberModel = requireOption(objectrepository, 'MemberModel');

  return function (req, res, next) {
    MemberModel.find({}, (err, members) => {
      if (err) {
        return next(err);
      }

      return res.json(members);
    });
  };
};
