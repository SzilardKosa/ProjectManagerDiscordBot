class Member {
	constructor(id) {
		this._discordId = id;
		this._name = null;
		this._done = 0;
	}

	toJson() {
		return {
			discordId: this._discordId,
			userName: this._name,
		};
	}

}

module.exports = Member;