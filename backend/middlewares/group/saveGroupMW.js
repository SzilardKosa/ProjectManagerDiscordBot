/**
 * Saves a group in the db
 * returns the result as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const GroupModel = requireOption(objectrepository, 'GroupModel');

  return function (req, res, next) {
    if (typeof req.body.discordId === 'undefined') {
      return next('discordId is undefined');
    }

    let group = new GroupModel();
    group.discordId = req.body.discordId;
    group._server = res.locals.server._id;
    group.serverDiscordId = res.locals.server.discordId;

    group.save((err, newGroup) => {
      if (err || !newGroup) {
        return next(err || 'newGroup not found');
      }

      return res.json(newGroup);
    });
  };
};
