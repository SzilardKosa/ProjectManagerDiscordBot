/**
 * Saves a subtask in the db
 * returns the result as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const SubtaskModel = requireOption(objectrepository, 'SubtaskModel');

  return function (req, res, next) {
    if (
      typeof req.body.name === 'undefined' ||
      typeof req.body.deadline === 'undefined' ||
      typeof req.body.weight === 'undefined' ||
      typeof req.body.status === 'undefined' ||
      typeof req.body.ownerDiscordId === 'undefined'
    ) {
      return next('one or more field is undefined');
    }

    let subtask = new SubtaskModel();
    subtask.name = req.body.name;
    subtask.deadline = new Date(req.body.deadline);
    subtask.weight = req.body.weight;
    subtask.status = req.body.status;
    subtask.groupDiscordId = res.locals.project.groupDiscordId;
    subtask.projectName = res.locals.project.name;
    subtask._project = res.locals.project._id;
    subtask.ownerDiscordId = req.body.ownerDiscordId;

    subtask.save((err, newSubtask) => {
      if (err || !newSubtask) {
        return next(err || 'newSubtask not found');
      }

      return res.json(newSubtask);
    });
  };
};
