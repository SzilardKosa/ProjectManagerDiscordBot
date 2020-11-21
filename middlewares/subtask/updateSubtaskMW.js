/**
 * Updates a subtask in the db, the id used here is: res.locals.subtask._id
 * ends request
 */
const requireOption = require('../requireOption');

module.exports = function (objectrepository) {
  const SubtaskModel = requireOption(objectrepository, 'SubtaskModel');

  return function (req, res, next) {
    SubtaskModel.updateOne({ _id: res.locals.subtask._id }, req.body, (err) => {
      if (err) {
        return next(err);
      }

      return res.end();
    });
  };
};
