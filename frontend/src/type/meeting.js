class Meeting {
	constructor(name, date) {
		this._name = name;
		this._date = new Date(date);
		this._repeat = -1;
	}

	changeName(name) {
		this._name = name;
		return true;
	}

	changeDate(date) {
		if(isNaN(date.valueOf())) return false;
		this._date = date;
		return true;
	}

	setRepeat(repeat) {
		this._repeat = repeat;
	}

	toJson() {
		return {
			name: this._name,
			date: this._date.toISOString(),
			repeat: this._repeat,
		};
	}
}

module.exports = Meeting;