/**
 * Find a project in the db using the :projectID param and the group discordId
 * the result is saved to res.locals.project
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ProjectModel = requireOption(objectrepository, 'ProjectModel');

  return function (req, res, next) {
    ProjectModel.findOne(
      { name: req.params.projectID, _group: res.locals.group._id },
      (err, project) => {
        if (err || !project) {
          return next(err || 'project not found');
        }

        res.locals.project = project;
        return next();
      }
    );
  };
};
