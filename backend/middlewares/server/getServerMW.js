/**
 * Find a server in the db using the :serverID param
 * the result is saved to res.locals.server
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ServerModel = requireOption(objectrepository, 'ServerModel');

  return function (req, res, next) {
    ServerModel.findOne({ discordId: req.params.serverID }, (err, server) => {
      if (err || !server) {
        return next(err || 'discord server not found');
      }

      res.locals.server = server;
      return next();
    });
  };
};
