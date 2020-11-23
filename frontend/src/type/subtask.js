// InProgress, Done, Abandoned
const { DEFAULT_DATE } = require('../const.js');

class Subtask {
	constructor(name, membersID) {
		this._name = name;
		this._deadline = new Date(DEFAULT_DATE);
		this._weight = 0;
		this._status = 0;
		this._assignedto = membersID;
	}

	changeAssignedMembers(membersID) {
		this._assignedto = membersID;
		return true;
	}

	setDeadline(deadline) {
		if(isNaN(deadline.valueOf())) return false;
		this._deadline = deadline;
		return true;
	}

	changeStatus(percent) {
		const a = new Number(percent);
		if(a.valueOf() >= 0 && a.valueOf() <= 100) {
			this._status = a.valueOf();
			return true;
		}
		return false;
	}

	changeWeight(weight) {
		const a = new Number(weight);
		if(Number.isFinite(a.valueOf())) {
			this._weight = a.valueOf();
			return true;
		}
		return false;
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
			weight: this._weight,
			status: this._status,
			ownerDiscordId: this._assignedto,
		};
	}
}

module.exports = Subtask;