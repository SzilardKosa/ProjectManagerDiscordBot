class Group {
	constructor(id) {
		this._discordId = id;
	}

	toJson() {
		return {
			discordId: this._discordId,
		};
	}

}

module.exports = Group;