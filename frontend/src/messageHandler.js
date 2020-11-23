class MessageHandler {

	constructor(client) {
		this.client = client;
	}

	broadcastMessageToChannel(channelID, message) {
		this.client.channels.cache.get(channelID).send(message).catch((err) => console.log(`${err}`));
	}

	broadcastMessageToMembers(members, message) {
		members.array.forEach(memberId => {
			this.client.users.get(memberId).send(message).catch((err) => console.log(`${err}`));
		});
	}

	sendMessageToMember(memberId, message) {
		this.client.users.get(memberId).send(message).catch((err) => console.log(`${err}`));
	}
}
module.exports = MessageHandler;