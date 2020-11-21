/**
 * Saves a server in the db
 * returns the result as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ServerModel = requireOption(objectrepository, 'ServerModel');

  return function (req, res, next) {
    if (typeof req.body.discordId === 'undefined') {
      return next('discordId is undefined');
    }

    let server = new ServerModel();
    server.discordId = req.body.discordId;

    server.save((err, newServer) => {
      if (err || !newServer) {
        return next(err || 'newServer not found');
      }

      return res.json(newServer);
    });
  };
};
