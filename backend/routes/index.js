const sendJsonMW = require('../middlewares/sendJsonMW');
// Servers
const deleteServerMW = require('../middlewares/server/deleteServerMW');
const getServerMW = require('../middlewares/server/getServerMW');
const getServersMW = require('../middlewares/server/getServersMW');
const saveServerMW = require('../middlewares/server/saveServerMW');
// Groups
const deleteGroupMW = require('../middlewares/group/deleteGroupMW');
const getGroupMW = require('../middlewares/group/getGroupMW');
const getGroupsMW = require('../middlewares/group/getGroupsMW');
const getAllGroupsMW = require('../middlewares/group/getAllGroupsMW');
const saveGroupMW = require('../middlewares/group/saveGroupMW');
// Members
const deleteMemberMW = require('../middlewares/member/deleteMemberMW');
const getMemberMW = require('../middlewares/member/getMemberMW');
const getMembersMW = require('../middlewares/member/getMembersMW');
const getAllMembersMW = require('../middlewares/member/getAllMembersMW');
const saveMemberMW = require('../middlewares/member/saveMemberMW');
// Projects
const deleteProjectMW = require('../middlewares/project/deleteProjectMW');
const getProjectMW = require('../middlewares/project/getProjectMW');
const getProjectsMW = require('../middlewares/project/getProjectsMW');
const getAllProjectsMW = require('../middlewares/project/getAllProjectsMW');
const saveProjectMW = require('../middlewares/project/saveProjectMW');
const updateProjectMW = require('../middlewares/project/updateProjectMW');
// Subtasks
const deleteSubtaskMW = require('../middlewares/subtask/deleteSubtaskMW');
const getSubtaskMW = require('../middlewares/subtask/getSubtaskMW');
const getSubtasksMW = require('../middlewares/subtask/getSubtasksMW');
const getAllSubtasksMW = require('../middlewares/subtask/getAllSubtasksMW');
const saveSubtaskMW = require('../middlewares/subtask/saveSubtaskMW');
const updateSubtaskMW = require('../middlewares/subtask/updateSubtaskMW');
// Meetings
const deleteMeetingMW = require('../middlewares/meeting/deleteMeetingMW');
const getMeetingMW = require('../middlewares/meeting/getMeetingMW');
const getMeetingsMW = require('../middlewares/meeting/getMeetingsMW');
const getAllMeetingsMW = require('../middlewares/meeting/getAllMeetingsMW');
const saveMeetingMW = require('../middlewares/meeting/saveMeetingMW');
const updateMeetingMW = require('../middlewares/meeting/updateMeetingMW');

// Models
const ServerModel = require('../models/server');
const GroupModel = require('../models/group');
const MemberModel = require('../models/member');
const ProjectModel = require('../models/project');
const SubtaskModel = require('../models/subtask');
const MeetingModel = require('../models/meeting');

module.exports = function (app) {
  const objRepo = {
    ServerModel: ServerModel,
    GroupModel: GroupModel,
    MemberModel: MemberModel,
    ProjectModel: ProjectModel,
    SubtaskModel: SubtaskModel,
    MeetingModel: MeetingModel,
  };

  // Servers
  app.get('/servers', getServersMW(objRepo));
  app.post('/servers', saveServerMW(objRepo));
  app.delete('/servers/:serverID', getServerMW(objRepo), deleteServerMW(objRepo));

  // Groups
  app.get('/groups', getAllGroupsMW(objRepo));
  app.get('/groups/:serverID', getServerMW(objRepo), getGroupsMW(objRepo));
  app.post('/groups/:serverID', getServerMW(objRepo), saveGroupMW(objRepo));
  app.delete(
    '/groups/:serverID/:groupID',
    getServerMW(objRepo),
    getGroupMW(objRepo),
    deleteGroupMW(objRepo)
  );

  // Members
  app.get('/members', getAllMembersMW(objRepo));
  app.get('/members/:groupID', getGroupMW(objRepo), getMembersMW(objRepo));
  app.post('/members/:groupID', getGroupMW(objRepo), saveMemberMW(objRepo));
  app.delete(
    '/members/:groupID/:memberID',
    getGroupMW(objRepo),
    getMemberMW(objRepo),
    deleteMemberMW(objRepo)
  );

  // Pojects
  app.get('/projects', getAllProjectsMW(objRepo));
  app.get('/projects/:groupID', getGroupMW(objRepo), getProjectsMW(objRepo));
  app.get(
    '/projects/:groupID/:projectID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    sendJsonMW(objRepo, 'project')
  );
  app.post('/projects/:groupID', getGroupMW(objRepo), saveProjectMW(objRepo));
  app.put(
    '/projects/:groupID/:projectID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    updateProjectMW(objRepo)
  );
  app.delete(
    '/projects/:groupID/:projectID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    deleteProjectMW(objRepo)
  );

  // Subtasks
  app.get('/subtasks', getAllSubtasksMW(objRepo));
  app.get(
    '/subtasks/:groupID/:projectID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    getSubtasksMW(objRepo)
  );
  app.get(
    '/subtasks/:groupID/:projectID/:subtaskID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    getSubtaskMW(objRepo),
    sendJsonMW(objRepo, 'subtask')
  );
  app.post(
    '/subtasks/:groupID/:projectID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    saveSubtaskMW(objRepo)
  );
  app.put(
    '/subtasks/:groupID/:projectID/:subtaskID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    getSubtaskMW(objRepo),
    updateSubtaskMW(objRepo)
  );
  app.delete(
    '/subtasks/:groupID/:projectID/:subtaskID',
    getGroupMW(objRepo),
    getProjectMW(objRepo),
    getSubtaskMW(objRepo),
    deleteSubtaskMW(objRepo)
  );

  // Meetings
  app.get('/meetings', getAllMeetingsMW(objRepo));
  app.get('/meetings/:groupID', getGroupMW(objRepo), getMeetingsMW(objRepo));
  app.get(
    '/meetings/:groupID/:meetingID',
    getGroupMW(objRepo),
    getMeetingMW(objRepo),
    sendJsonMW(objRepo, 'meeting')
  );
  app.post('/meetings/:groupID', getGroupMW(objRepo), saveMeetingMW(objRepo));
  app.put(
    '/meetings/:groupID/:meetingID',
    getGroupMW(objRepo),
    getMeetingMW(objRepo),
    updateMeetingMW(objRepo)
  );
  app.delete(
    '/meetings/:groupID/:meetingID',
    getGroupMW(objRepo),
    getMeetingMW(objRepo),
    deleteMeetingMW(objRepo)
  );
};
