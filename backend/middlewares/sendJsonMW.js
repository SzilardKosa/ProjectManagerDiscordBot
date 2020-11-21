/**
 * Sends a json response based on the keyName
 */

const requireOption = require('./requireOption');

module.exports = function (objectrepository, keyName) {
  return function (req, res) {
    res.json(res.locals[keyName]);
  };
};
