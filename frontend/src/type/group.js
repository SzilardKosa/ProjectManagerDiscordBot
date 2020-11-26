class Group {
	constructor(id) {
		this._discordId = id;
		this._serverId = null;
	}

	toJson() {
		return {
			discordId: this._discordId,
		};
	}

}

module.exports = Group;