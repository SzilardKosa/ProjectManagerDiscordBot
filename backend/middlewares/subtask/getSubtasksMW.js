/**
 * Find all subtasks in the db to res.locals.project._id
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const SubtaskModel = requireOption(objectrepository, 'SubtaskModel');

  return function (req, res, next) {
    SubtaskModel.find({ _project: res.locals.project._id }, (err, subtasks) => {
      if (err) {
        return next(err);
      }

      return res.json(subtasks);
    });
  };
};
