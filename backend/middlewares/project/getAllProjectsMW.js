/**
 * Find all projects in the db
 * return them as json
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ProjectModel = requireOption(objectrepository, 'ProjectModel');

  return function (req, res, next) {
    ProjectModel.find({}, (err, projects) => {
      if (err) {
        return next(err);
      }

      return res.json(projects);
    });
  };
};
