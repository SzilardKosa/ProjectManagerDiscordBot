/**
 * Updates a project in the db, the id used here is: res.locals.project._id
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const ProjectModel = requireOption(objectrepository, 'ProjectModel');

  return function (req, res, next) {
    ProjectModel.updateOne({ _id: res.locals.project._id }, req.body, (err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
