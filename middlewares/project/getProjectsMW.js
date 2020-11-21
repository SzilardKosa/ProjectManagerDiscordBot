/**
 * Find all projects in the db to res.locals.group._id
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ProjectModel = requireOption(objectrepository, 'ProjectModel');

  return function (req, res, next) {
    ProjectModel.find({ _group: res.locals.group._id }, (err, projects) => {
      if (err) {
        return next(err);
      }

      return res.json(projects);
    });
  };
};
