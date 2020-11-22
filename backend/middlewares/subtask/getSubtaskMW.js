/**
 * Find a subtask in the db using the :subtaskID param and the project._id
 * the result is saved to res.locals.subtask
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const SubtaskModel = requireOption(objectrepository, 'SubtaskModel');

  return function (req, res, next) {
    SubtaskModel.findOne(
      { name: req.params.subtaskID, _project: res.locals.project._id },
      (err, subtask) => {
        if (err || !subtask) {
          return next(err || 'subtask not found');
        }

        res.locals.subtask = subtask;
        return next();
      }
    );
  };
};
