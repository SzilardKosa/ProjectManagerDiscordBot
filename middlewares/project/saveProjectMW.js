/**
 * Saves a project in the db
 * returns the result as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ProjectModel = requireOption(objectrepository, 'ProjectModel');

  return function (req, res, next) {
    if (
      typeof req.body.name === 'undefined' ||
      typeof req.body.deadline === 'undefined' ||
      typeof req.body.status === 'undefined'
    ) {
      return next('one or more field is undefined');
    }

    let project = new ProjectModel();
    project.name = req.body.name;
    project.deadline = new Date(req.body.deadline);
    project.status = req.body.status;
    project._group = res.locals.group._id;
    project.groupDiscordId = res.locals.group.discordId;

    project.save((err, newProject) => {
      if (err || !newProject) {
        return next(err || 'newProject not found');
      }

      return res.json(newProject);
    });
  };
};
