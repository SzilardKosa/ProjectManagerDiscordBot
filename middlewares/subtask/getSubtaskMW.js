/**
 * Find a subtask in the db using the :subtaskID param
 * the result is saved to res.locals.subtask
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const SubtaskModel = requireOption(objectrepository, 'SubtaskModel');

  return function (req, res, next) {
    SubtaskModel.findOne({ _id: req.params.subtaskID }, (err, subtask) => {
      if (err || !subtask) {
        return next(err || 'subtask not found');
      }

      res.locals.subtask = subtask;
      return next();
    });
  };
};
