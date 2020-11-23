// InProgress, Done, Abandoned
const { STATUS, DEFAULT_DATE } = require('./../const.js');

class Project {
	constructor(name) {
		this._name = name;
		this._deadline = new Date(DEFAULT_DATE);
		this._subtasks = [];
		this._status = STATUS[0];
	}

	setDeadline(deadline) {
		if(isNaN(deadline.valueOf())) return false;
		this._deadline = deadline;
		return true;
	}

	addSubtask(subtask) {
		this._subtasks.push(subtask);
		return true;
	}

	changeStatus(status) {
		if(!STATUS.includes(status)) {
			// messageHandler.broadcastMessageToChannel(client.channels.cache.find(channela => channela.name === 'test').id, 'No such status.');
			return false;
		}
		this._status = status;
		return true;
	}

	changeName(name) {
		this._name = name;
		return true;
	}

	toStringG() {
		return `Name: ${this._name}, deadline: ${this._deadline}, subtask number: ${this._subtasks.length}, status: ${this._status}`;
	}

	toJson() {
		return {
			name: this._name,
			deadline: this._deadline.toISOString(),
			status: this._status,
		};
	}
}

module.exports = Project;