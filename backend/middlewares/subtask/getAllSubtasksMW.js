/**
 * Find all subtasks in the db
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const SubtaskModel = requireOption(objectrepository, 'SubtaskModel');

  return function (req, res, next) {
    SubtaskModel.find({}, (err, subtasks) => {
      if (err) {
        return next(err);
      }

      return res.json(subtasks);
    });
  };
};
