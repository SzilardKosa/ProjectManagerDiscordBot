const { DEFAULT_HOST } = require('../const.js');

const axios = require('axios');

class db_handler {
	post(uri, body) {
		console.log(`Post called to database ${uri}`);
		return axios
			.post(DEFAULT_HOST + uri, body);
	}

	get(uri) {
		console.log(`Get called to database ${uri}`);
		return axios
			.get(DEFAULT_HOST + uri);
	}

	del(uri) {
		console.log(`Del called to database ${uri}`);
		return axios
			.delete(DEFAULT_HOST + uri);
	}

	put(uri, body) {
		console.log(`Put called to database ${uri}`);
		return axios
			.put(DEFAULT_HOST + uri, body);
	}
}

class db_server {
	constructor() {
		this._db_handler = new db_handler();
	}

	get() {
		return this._db_handler.get('/servers');
	}

	del(serverId) {
		return this._db_handler.del(`/servers/${serverId}`);
	}

	post(serverId) {
		return this._db_handler.post('/servers', { discordId : serverId });
	}
}

class db_group {
	constructor() {
		this._db_handler = new db_handler();
	}

	get(serverId) {
		return this._db_handler.get(`/groups/${serverId}`);
	}

	del(serverId, groupId) {
		return this._db_handler.del(`/groups/${serverId}/${groupId}`);
	}

	post(serverId, groupId) {
		return this._db_handler.post(`/groups/${serverId}`, { discordId : groupId });
	}
}

class db_member {
	constructor() {
		this._db_handler = new db_handler();
	}

	get(groupId) {
		return this._db_handler.get(`/members/${groupId}`);
	}

	del(groupId, memberId) {
		return this._db_handler.del(`/members/${groupId}/${memberId}`);
	}

	post(groupId, memberId) {
		return this._db_handler.post(`/members/${groupId}`, { discordId : memberId });
	}
}

class db_project {
	constructor() {
		this._db_handler = new db_handler();
	}

	get(groupId, projectName) {
		return this._db_handler.get(`/projects/${groupId}/${projectName}`);
	}

	get_all(groupId) {
		return this._db_handler.get(`/projects/${groupId}`);
	}

	del(groupId, projectName) {
		return this._db_handler.del(`/projects/${groupId}/${projectName}`);
	}

	post(groupId, project) {
		return this._db_handler.post(`/projects/${groupId}`, project.toJson());
	}

	put(groupId, projectName, project) {
		return this._db_handler.put(`/projects/${groupId}/${projectName}`, project.toJson());
	}
}

class db_sub_task {
	constructor() {
		this._db_handler = new db_handler();
	}

	get(groupId, projectName, subtaskName) {
		return this._db_handler.get(`/subtasks/${groupId}/${projectName}/${subtaskName}`);
	}

	get_all(groupId, projectName) {
		return this._db_handler.get(`/subtasks/${groupId}/${projectName}`);
	}

	del(groupId, projectName, subtaskName) {
		return this._db_handler.del(`/subtasks/${groupId}/${projectName}/${subtaskName}`);
	}

	post(groupId, projectName, subtask) {
		return this._db_handler.post(`/subtasks/${groupId}/${projectName}`, subtask.toJson());
	}

	put(groupId, projectName, subtaskName, subtask) {
		return this._db_handler.put(`/subtasks/${groupId}/${projectName}/${subtaskName}`, subtask.toJson());
	}
}

class db_meeting {
	constructor() {
		this._db_handler = new db_handler();
	}

	get(groupId, meetingId) {
		return this._db_handler.get(`/meetings/${groupId}/${meetingId}`);
	}

	get_all(groupId) {
		return this._db_handler.get(`/meetings/${groupId}`);
	}

	del(groupId, meetingId) {
		return this._db_handler.del(`/meetings/${groupId}/${meetingId}`);
	}

	post(groupId, meeting) {
		return this._db_handler.post(`/meetings/${groupId}`, meeting.toJson());
	}

	put(groupId, meetingId, meeting) {
		return this._db_handler.put(`/meetings/${groupId}/${meetingId}`, meeting.toJson());
	}
}

module.exports = { db_handler, db_server, db_group, db_member, db_project, db_sub_task, db_meeting };