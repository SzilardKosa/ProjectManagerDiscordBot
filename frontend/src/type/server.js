class Server {
	constructor(id) {
		this._discordId = id;
	}

	toJson() {
		return {
			discordId: this._discordId,
		};
	}

}


module.exports = Server;