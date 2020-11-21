/**
 * Saves a memeber in the db
 * returns the result as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const MemberModel = requireOption(objectrepository, 'MemberModel');

  return function (req, res, next) {
    if (typeof req.body.discordId === 'undefined') {
      return next('discordId is undefined');
    }

    let member = new MemberModel();
    member.discordId = req.body.discordId;
    member._group = res.locals.group._id;
    member.groupDiscordId = res.locals.group.discordId;

    member.save((err, newMember) => {
      if (err || !newMember) {
        return next(err || 'newMember not found');
      }

      return res.json(newMember);
    });
  };
};
