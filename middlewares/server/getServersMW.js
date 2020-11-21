/**
 * Find all servers in the db
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ServerModel = requireOption(objectrepository, 'ServerModel');

  return function (req, res, next) {
    ServerModel.find({}, (err, servers) => {
      if (err) {
        return next(err);
      }

      return res.json(servers);
    });
  };
};
