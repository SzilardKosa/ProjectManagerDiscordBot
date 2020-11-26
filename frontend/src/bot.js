require('dotenv').config();

const { PREFIX, DEFAULT_DATE } = require('./const.js');
const { Client, MessageEmbed } = require('discord.js');

const { db_server, db_group, db_member, db_project, db_sub_task, db_meeting } = require('./db_handler/db_handler.js');

const Meeting = require('./type/meeting.js');
const Project = require('./type/project.js');
const Server = require('./type/server.js');
const Subtask = require('./type/subtask.js');
const Group = require('./type/group.js');
const Member = require('./type/member.js');
const cron = require('node-cron');

const ServerDbHandler = new db_server;
const GroupDbHandler = new db_group;
const MemberDbHandler = new db_member;
const ProjectDbHandler = new db_project;
const SubtaskDbHandler = new db_sub_task;
const MeetingDbHandler = new db_meeting;

const cronMeetings = new Map();

const client = new Client();

function registerGroup(message) {
	GroupDbHandler.get(message.guild.id)
		.then(resp => {
			var groups = [];
			for (const data of resp.data) {
				groups.push(new Group(data.discordId));
			}
			if(groups.find(group => group._discordId === message.channel.id) === undefined) {
				GroupDbHandler.post(message.guild.id, message.channel.id)
					.then(respons => {
						console.log(`Post successfull /group/${message.guild.id}/${respons.data.discordId}`);
						registerMembers(message);
					})
					.catch(error => console.log(`Post failed /group/${message.guild.id}/${error.response.data.error.keyValue.discordId}`));
			}
			else {
				registerMembers(message);
				console.log(`Channel already registered ${message.channel.name}`);
			}
		})
		.catch(error => {console.log(error.response.data);});
}

function registerMembers(message) {
	MemberDbHandler.get(message.channel.id)
		.then(resp => {
			var members = [];
			for (const data of resp.data) {
				members.push(new Member(data.discordId));
			}
			message.channel.members
				.partition(member => !member.user.bot)[0]
				.map(member => {
					if(members.find(element => element._discordId == member.id) === undefined) {
						MemberDbHandler.post(message.channel.id, member.user.id, member.user.username)
							.then(respons => console.log(`Post successfull /members/${message.channel.id}/${respons.data.discordId}`))
							.catch(error => console.log(`${error.response.data.error.data.error.keyValue}`));
						// console.log(`Post failed /members/${message.channel.id}/${error.response.data.error.keyValue}`
					}
				});
		})
		.catch(error => {console.log(error.response.data);});
}

function registerServer() {
	ServerDbHandler.get()
		.then(resp => {
			var servers = [];
			for (const data of resp.data) {
				servers.push(new Server(data.discordId));
			}

			client.guilds.cache.map(guild => {
				if(servers.find(server => server._discordId === guild.id) === undefined) {
					ServerDbHandler.post(guild.id)
						.then(respons => console.log(`Post successfull /servers/${respons.data.discordId}`))
						.catch(error => console.log(`Post failed /servers/${error.response.data.error.keyValue.discordId}`));
				}
			});
		})
		.catch(error => {console.log(error.response.data);});
}

function modifyProject(message, args, projects) {

	if(projects.find(project => project._name === args[0]) === undefined) {
		message.channel.send(`No project with name: ${args[0]} exist.`);
		return false;
	}

	if(args.length < 3) {
		message.channel.send('Not enough argument given.');
		return false;
	}

	var pr = projects.find(project => project._name === args[0]);

	switch(args[1]) {
	case 'deadline':
		if (!pr.setDeadline(new Date(args[2]))) {
			message.channel.send(`Not valid project deadline: ${args[2]}.`);
			return false;
		}
		break;
	case 'name':
		if (!pr.changeName(args[2])) {
			message.channel.send(`Not valid project name: ${args[2]}.`);
			return false;
		}
		break;
	case 'status':
		if (!pr.changeStatus(args[2])) {
			message.channel.send(`Not valid project status: ${args[2]}.`);
			return false;
		}
		break;
	default:
		message.channel.send(`Project has no property with name: ${args[1]}.`);
		return false;
	}
	message.channel.send(`Project ${args[0]} property ${args[1]} successfully modified.`);
	ProjectDbHandler.put(message.channel.id, args[0], pr);
	return true;
}
function modifyMeeting(message, args, meetings) {

	if(meetings.find(meeting => meeting._name === args[0]) === undefined) {
		message.channel.send(`No meeting with name: ${args[0]} exist.`);
		return false;
	}

	if(args.length < 3) {
		message.channel.send('Not enough argument given.');
		return false;
	}

	var mg = meetings.find(meeting => meeting._name === args[0]);

	switch(args[1]) {
	case 'date':
		if (!mg.changeDate(new Date(args[2]))) {
			message.channel.send(`Not valid meeting date: ${args[2]}.`);
			return false;
		}
		break;
	case 'name':
		if (!mg.changeName(args[2])) {
			message.channel.send(`Not valid meeting name: ${args[2]}.`);
			return false;
		}
		break;
	case 'repeat':
		if (!mg.setRepeat(args[2])) {
			message.channel.send(`Not valid meeting repeat interval: ${args[2]}.`);
			return false;
		}
		break;
	default:
		message.channel.send(`Meeting has no property with name: ${args[1]}.`);
		return false;
	}
	startMeeting(mg);
	message.channel.send(`Meeting ${args[0]} property ${args[1]} successfully modified.`);
	MeetingDbHandler.put(message.channel.id, args[0], mg);
	return true;
}
function modifySubtask(message, args, subtasks, members) {
	var st = subtasks.find(subtask => subtask._name === args[1]);

	switch(args[2]) {
	case 'deadline':
		if (!st.setDeadline(new Date(args[3]))) {
			message.channel.send(`Not valid subtask deadline: ${args[3]}.`);
			return false;
		}
		break;
	case 'name':
		if (!st.changeName(args[3])) {
			message.channel.send(`Not valid meeting name: ${args[3]}.`);
			return false;
		}
		break;
	case 'weight':
		if (!st.changeWeight(args[3])) {
			message.channel.send(`Not valid subtask weight: ${args[3]}.`);
			return false;
		}
		break;
	case 'status':
		if (!st.changeStatus(args[3])) {
			message.channel.send(`Not valid subtask status: ${args[3]}.`);
			return false;
		}
		break;
	case 'assign':
		var id = client.users.cache.find(user => user.username === args[3]);
		if(!(id === undefined)) {
			if(members.find(member => member._discordId === id.id) === undefined) {
				message.channel.send(`${args[3]} not a valid userName in the group.`);
				return false;
			}
			else {
				st.changeAssignedMembers(id.id);
			}
		}
		else {
			message.channel.send(`${args[3]} not a valid userName`);
			return false;
		}
		break;
	default:
		message.channel.send(`Subtask has no property with name: ${args[2]}.`);
		return false;
	}
	message.channel.send(`Subtask ${args[1]} in project ${args[0]} property ${args[2]} successfully modified.`);
	SubtaskDbHandler.put(message.channel.id, args[0], args[1], st);
	return true;
}

function createProject(message, args, projects) {
	if(args.length === 0) {
		message.channel.send('Not enough argument given.');
		return false;
	}

	if(!(projects.find(project => project._name === args[0]) === undefined)) {
		message.channel.send(`Project with name: ${args[0]} already exist`);
		return false;
	}
	var pr = new Project(args[0]);

	if((args.length === 1)) {
		message.channel.send(`Please initialize the deadline. With the command ${PREFIX}modify project ${args[0]} deadline 'deadline'`);
		pr.setDeadline(new Date(DEFAULT_DATE));
		ProjectDbHandler.post(message.channel.id, pr);
		return false;
	}
	if(isNaN(new Date(args[1]).valueOf())) {
		message.channel.send(`Wrong deadline format. Initialize deadline with the command ${PREFIX}modify project ${args[0]} deadline 'deadline'`);
		pr.setDeadline(new Date(DEFAULT_DATE));
		ProjectDbHandler.post(message.channel.id, pr);
		return false;
	}
	pr.setDeadline(new Date(args[1]));
	message.channel.send(`Project created with name: ${args[0]}, and deadline: ${args[1]}`);
	ProjectDbHandler.post(message.channel.id, pr);
	return true;
}
function createMeeting(message, args, meetings) {
	if(args.length < 2) {
		message.channel.send('Not enough argument given.');
		return false;
	}

	if(!(meetings.find(meeting => meeting._name === args[0]) === undefined)) {
		message.channel.send(`Meeting with name: ${args[0]} already exist`);
		return false;
	}

	if(isNaN(new Date(args[1]).valueOf())) {
		message.channel.send(`Wrong date format ${args[1]}`);
		return false;
	}
	var mg = new Meeting(args[0], args[1]);
	if(args.length >= 3) mg.setRepeat(args[2]);
	mg._group = message.channel.id;
	startMeeting(mg);
	message.channel.send(`Meeting created with name: ${args[0]}, and date: ${args[1]}`);
	MeetingDbHandler.post(message.channel.id, mg);
	return true;
}
function createSubTask(message, args, members) {
	var st = new Subtask(args[1], message.author.id);

	if((args.length === 2)) {
		message.channel.send(`No deadline given. Please initialize the deadline. With the command ${PREFIX}modify subtask ${args[0]} ${args[1]} deadline 'deadline'`);
		st.setDeadline(new Date(DEFAULT_DATE));
		SubtaskDbHandler.post(message.channel.id, args[0], st);
		return false;
	}
	if(isNaN(new Date(args[2]).valueOf())) {
		message.channel.send(`Wrong deadline format. Please initialize the deadline. With the command ${PREFIX}modify subtask ${args[0]} ${args[1]} deadline 'deadline'`);
		st.setDeadline(new Date(DEFAULT_DATE));
		SubtaskDbHandler.post(message.channel.id, args[0], st);
		return false;
	}
	st.setDeadline(new Date(args[2]));

	if(args.length > 3) {
		if(!st.changeWeight(args[3])) {
			message.channel.send(`${args[3]} is not a valid number. Initialized with 0.`);
		}

	}

	if(args.length > 4) {
		const id = client.users.cache.find(user => user.username === args[4]);
		if(!(id === undefined)) {
			if(members.find(member => member._discordId === id.id) === undefined) {
				message.channel.send(`${args[4]} not a valid userName in the group.`);
			}
			else {
				st.changeAssignedMembers(id.id);
			}
		}
		else {
			message.channel.send(`${args[4]} not a valid userName`);
		}
	}

	message.channel.send(`Subtask created with name: ${args[1]}, and deadline: ${args[2]} for project ${args[0]}`);
	SubtaskDbHandler.post(message.channel.id, args[0], st);
	return true;
}

const methodManager = {

	create(message, args) {
		const [CMD, ...arg] = args;
		switch(CMD) {
		case 'project':
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					for (const data of resp.data) {
						projects.push(new Project(data.name));
					}

					createProject(message, arg, projects);
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'subtask':
			if(arg.length < 4) {
				message.channel.send('Not enough argument given.');
				return false;
			}
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					for (const data of resp.data) {
						projects.push(new Project(data.name));
					}

					if(projects.find(project => project._name === arg[0]) === undefined) {
						message.channel.send(`No project with name: ${arg[0]} exist.`);
						return false;
					}

					SubtaskDbHandler.get_all(message.channel.id, arg[0])
						.then(stResp => {
							var subtasks = [];
							for (const data of stResp.data) {
								subtasks.push(new Subtask(data.name, data.ownerDiscordId));
							}

							if(!(subtasks.find(subtask => subtask._name === arg[1]) === undefined)) {
								message.channel.send(`Subtask with name: ${arg[1]} already exist`);
								return false;
							}

							MemberDbHandler.get(message.channel.id)
								.then(mResp => {
									var members = [];
									for (const data of mResp.data) {
										members.push(new Member(data.discordId));
									}
									createSubTask(message, arg, members);
								})
								.catch(error => {console.log(error.response.data);});
						})
						.catch(error => {console.log(error.response.data);});
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'meeting':
			MeetingDbHandler.get_all(message.channel.id)
				.then(resp => {
					var meetings = [];
					for (const data of resp.data) {
						meetings.push(new Meeting(data.name));
					}
					createMeeting(message, arg, meetings);
				})
				.catch(error => {console.log(error);});
			break;
		default:
			message.channel.send(`No such command ${CMD}`);
		}
	},
	modify(message, args) {
		const [CMD, ...arg] = args;
		switch(CMD) {
		case 'project':
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					for (const data of resp.data) {
						var project = new Project(data.name);
						project.setDeadline(new Date(data.deadline));
						project.changeStatus(data.status);
						projects.push(project);
					}
					modifyProject(message, arg, projects);
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'subtask':
			if(arg.length < 4) {
				message.channel.send('Not enough argument given.');
				return false;
			}
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					for (const data of resp.data) {
						projects.push(new Project(data.name));
					}

					if(projects.find(project => project._name === arg[0]) === undefined) {
						message.channel.send(`No project with name: ${arg[0]} exist.`);
						return false;
					}

					SubtaskDbHandler.get_all(message.channel.id, arg[0])
						.then(stResp => {
							var subtasks = [];
							for (const data of stResp.data) {
								var subtask = new Subtask(data.name, data.ownerDiscordId);
								subtask.changeWeight(data.weight);
								subtask.setDeadline(new Date(data.deadline));
								subtask.changeStatus(data.status);
								subtasks.push(subtask);
							}
							if(subtasks.find(subt => subt._name === arg[1]) === undefined) {
								message.channel.send(`No subtask with name: ${arg[1]} exist.`);
								return false;
							}

							MemberDbHandler.get(message.channel.id)
								.then(mResp => {
									var members = [];
									for (const data of mResp.data) {
										members.push(new Member(data.discordId));
									}
									modifySubtask(message, arg, subtasks, members);
								})
								.catch(error => {console.log(error);});
						})
						.catch(error => {console.log(error.response.data);});
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'meeting':
			MeetingDbHandler.get_all(message.channel.id)
				.then(resp => {
					var meetings = [];
					for (const data of resp.data) {
						var meeting = new Meeting(data.name, new Date(data.date));
						meeting.setRepeat(data.repeat);
						meeting._group = data.groupDiscordId;
						meetings.push(meeting);
					}
					modifyMeeting(message, arg, meetings);
				})
				.catch(error => {console.log(error);});
			break;
		default:
			message.channel.send(`No such command ${CMD}`);
		}
	},
	list(message, args) {
		const [CMD, ...arg] = args;
		switch(CMD) {
		case 'project':
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					var mes = 'Project name \t status \t number of subtasks \t deadline';
					for (const data of resp.data) {
						var project = new Project(data.name);
						project.setDeadline(new Date(data.deadline));
						project.changeStatus(data.status);
						projects.push(project);
						SubtaskDbHandler.get_all(message.channel.id, data.name)
							.then(res => {
								mes += `\n${data.name} \t ${data.status} \t ${res.data.length} \t ${data.deadline}`;
							});
					}
					SubtaskDbHandler.get_all(message.channel.id, projects[0]._name)
						.then(res => {
							console.log(res);
							message.channel.send(mes);
						});
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'subtask':
			if(arg.length < 1) {
				message.channel.send('Not enough argument given.');
				return false;
			}
			MemberDbHandler.get(message.channel.id)
				.then(resm => {
					var members = [];
					for (const data of resm.data) {
						var member = new Member(data.discordId);
						member._name = data.userName;
						members.push(member);
					}
					ProjectDbHandler.get_all(message.channel.id)
						.then(resp => {
							var projects = [];
							for (const data of resp.data) {
								projects.push(new Project(data.name));
							}

							if(projects.find(project => project._name === arg[0]) === undefined) {
								message.channel.send(`No project with name: ${arg[0]} exist.`);
								return false;
							}

							SubtaskDbHandler.get_all(message.channel.id, arg[0])
								.then(stResp => {
									var mes = 'Subtask name \t status \t weight \t assignedTo \t deadline';
									var subtasks = [];
									for (const data of stResp.data) {
										subtasks.push(new Subtask(data.name, data.ownerDiscordId));
										mes += `\n${data.name} \t  ${data.status} \t ${data.weight} \t ${members.find(memb => memb._discordId === data.ownerDiscordId)._name} \t ${data.deadline}`;
									}
									message.channel.send(mes);
								})
								.catch(error => {console.log(error);});
						})
						.catch(error => {console.log(error.response.data);});
				})
				.catch(error => {console.log(error.response.data);});

			break;
		case 'meeting':
			MeetingDbHandler.get_all(message.channel.id)
				.then(resp => {
					var meetings = [];
					var mes = 'Meeting name \t repeat \t date';
					for (const data of resp.data) {
						meetings.push(new Meeting(data.name));
						mes += `\n${data.name} \t ${data.repeat} \t ${data.date}`;
					}
					message.channel.send(mes);
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'member':
			MemberDbHandler.get(message.channel.id)
				.then(resp => {
					var mes = 'Member name \t id';
					for (const data of resp.data) {
						mes += `\n${data.userName} \t ${data.discordId}`;
					}
					message.channel.send(mes);
				})
				.catch(error => {console.log(error);});
			break;
		default:
			message.channel.send(`No such command ${CMD}`);
		}
	},
	delete(message, args) {
		const [CMD, ...arg] = args;
		switch(CMD) {
		case 'project':
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					for (const data of resp.data) {
						projects.push(new Project(data.name));
					}
					if(arg.length === 0) {
						message.channel.send('Not enough argument given.');
						return false;
					}
					if((projects.find(project => project._name === arg[0]) === undefined)) {
						message.channel.send(`Project with name: ${arg[0]} does not exist`);
						return false;
					}
					ProjectDbHandler.del(message.channel.id, arg[0])
						.then(message.channel.send(`Project ${arg[0]} is sucessfully deleted.`));
				})
				.catch(error => {console.log(error);});
			break;
		case 'subtask':
			if(arg.length < 1) {
				message.channel.send('Not enough argument given.');
				return false;
			}
			ProjectDbHandler.get_all(message.channel.id)
				.then(resp => {
					var projects = [];
					for (const data of resp.data) {
						projects.push(new Project(data.name));
					}

					if(projects.find(project => project._name === arg[0]) === undefined) {
						message.channel.send(`No project with name: ${arg[0]} exist.`);
						return false;
					}

					SubtaskDbHandler.get_all(message.channel.id, arg[0])
						.then(stResp => {
							var subtasks = [];
							for (const data of stResp.data) {
								subtasks.push(new Subtask(data.name, data.ownerDiscordId));
							}

							if(subtasks.find(subtask => subtask._name === arg[1]) === undefined) {
								message.channel.send(`No subtask with name: ${arg[1]} exist.`);
								return false;
							}
							SubtaskDbHandler.del(message.channel.id, arg[0], arg[1])
								.then(message.channel.send(`Subtask ${arg[1]} is sucessfully deleted.`));
						})
						.catch(error => {console.log(error.response.data);});
				})
				.catch(error => {console.log(error.response.data);});
			break;
		case 'meeting':
			MeetingDbHandler.get_all(message.channel.id)
				.then(resp => {
					var meetings = [];
					for (const data of resp.data) {
						meetings.push(new Meeting(data.name));
					}
					if(arg.length === 0) {
						message.channel.send('Not enough argument given.');
						return false;
					}
					if((meetings.find(project => project._name === arg[0]) === undefined)) {
						message.channel.send(`Project with name: ${arg[0]} does not exist`);
						return false;
					}
					console.log(`${arg[0]} meeting schedule is destryoyed()`);
					cronMeetings[arg[0]].destroy();
					MeetingDbHandler.del(message.channel.id, arg[0])
						.then(message.channel.send(`Project ${arg[0]} is sucessfully deleted.`));
				})
				.catch(error => {console.log(error.response.data);});
			break;
		default:
			message.channel.send(`No such command ${CMD}`);
		}
	},
};

function getStatistic(message, args) {
	if(!(args.length === 1)) {
		message.channel.send('Wrong argument number given.');
		return false;
	}
	ProjectDbHandler.get_all(message.channel.id)
		.then(resp => {
			var projects = [];
			for (const data of resp.data) {
				projects.push(new Project(data.name));
			}
			if((projects.find(project => project._name === args[0]) === undefined)) {
				message.channel.send(`Project with name: ${args[0]} does not exist`);
				return false;
			}

			SubtaskDbHandler.get_all(message.channel.id, args[0])
				.then(stResp => {
					var subtasks = [];
					for (const data of stResp.data) {
						var subtask = new Subtask(data.name, data.ownerDiscordId);
						subtask.changeWeight(data.weight);
						subtask.setDeadline(new Date(data.deadline));
						subtask.changeStatus(data.status);
						subtasks.push(subtask);
					}
					MemberDbHandler.get(message.channel.id)
						.then(mResp => {

							var members = [];
							for (const data of mResp.data) {
								var member = new Member(data.discordId);
								member._name = data.userName;
								members.push(member);
							}
							var weightSum = 0;
							var weightPSum = 0;
							for(var subt of subtasks) {
								weightSum += subt._weight;
								weightPSum += subt._weight * subt._status / 100;
								var a = members.find(memb => memb._discordId === subt._assignedto);
								if(!(a === undefined)) {
									a._done += subt._weight * subt._status / 100;
								}
							}
							var mesMemb = '';
							var mesTask = '';
							for(var subt2 of subtasks) {
								mesTask += `\nst: \t ${subt2._name} -  Weight: ${subt2._weight} Status: ${subt2._status}`;
							}
							for(var memb of members) {
								if(weightPSum === 0) {
									mesMemb += `\n\t ${memb._name} -  ${memb._done / weightSum}: 100`;
								}
								else {
									mesMemb += `\n     \t\t ${memb._name} -  ${memb._done / weightSum * 100} : ${memb._done / weightPSum * 100}`;
								}
							}
							if(mesTask != '' && mesMemb != '') {
								var embed = new MessageEmbed()
								// Set the color of the embed
									.setColor(0xff0000)
								// Set the title of the field
									.setAuthor('Statistics')
								// Set the description.
									.setTitle(`${args[0]} - ${weightPSum / weightSum * 100}`)
									.addField('Subtasks:', mesTask)
									.addField('Members:', mesMemb);
								// Set the main content of the embed
								message.channel.send(embed);
							}
						});
				})
				.catch(error => {console.log(error.response.data);});

		})
		.catch(error => {console.log(error);});
}

function updateSubtaskStatus(message, args) {
	if(args.length < 3) {
		message.channel.send('Not enough argument given.');
		return false;
	}
	ProjectDbHandler.get_all(message.channel.id)
		.then(resp => {
			var projects = [];
			for (const data of resp.data) {
				projects.push(new Project(data.name));
			}

			if(projects.find(project => project._name === args[0]) === undefined) {
				message.channel.send(`No project with name: ${args[0]} exist.`);
				return false;
			}

			SubtaskDbHandler.get_all(message.channel.id, args[0])
				.then(stResp => {
					var subtasks = [];
					for (const data of stResp.data) {
						var subtask = new Subtask(data.name, data.ownerDiscordId);
						subtask.changeWeight(data.weight);
						subtask.setDeadline(new Date(data.deadline));
						subtask.changeStatus(data.status);
						subtasks.push(subtask);
					}
					if(subtasks.find(subt => subt._name === args[1]) === undefined) {
						message.channel.send(`No subtask with name: ${args[1]} exist.`);
						return false;
					}
					var st = subtasks.find(subt => subt._name === args[1]);
					if(!st.changeStatus(args[2])) {
						message.channel.send(`Not valid status: ${args[2]}.`);
						return false;
					}

					SubtaskDbHandler.put(message.channel.id, args[0], args[1], st)
						.then(message.channel.send(`Subtask updated: ${args[1]}.`));

				})
				.catch(error => {console.log(error);});
		})
		.catch(error => {console.log(error.response.data);});
}

function startMeetingSchedule(group) {
	MeetingDbHandler.get_all(group._discordId)
		.then(response => {
			var meetings = [];
			for(const meeting of response.data) {
				var meet = new Meeting(meeting.name, new Date(meeting.date));
				meet._repeat = meeting.repeat;
				meet._group = meeting.groupDiscordId;
				meetings.push(meet);
				// ${a.getMinutes()} ${a.getHours()} ${a.getDate()} ${a.getMonth()}
				startMeeting(meet);
			}
		})
		.catch(error => {console.log(error);});
}

function startMeeting(meet) {
	var currentTime = new Date();
	var a = meet._date;
	// || meet._date.getMonth() < currentTime.getMonth() || meet._date.getFullYear() < currentTime.getFullYear()
	if(meet._repeat != -1 && (meet._date.getFullYear() < currentTime.getFullYear())) {
		meet._date.setFullYear(currentTime.getFullYear());
		startMeeting(meet);
		return false;
	}
	if(meet._repeat != -1 && (meet._date.getTime() < currentTime.getTime())) {
		meet._date.setDate(a.getDate() + Number(meet._repeat));
		startMeeting(meet);
		return false;
	}
	if(cronMeetings[meet._name] != null) cronMeetings[meet._name].destroy();

	console.log(`${meet._name} meeting schedule is created`);
	if(Number(meet._repeat) === -1) {
		cronMeetings[meet._name] = cron.schedule(`${a.getSeconds()} ${a.getMinutes()} ${a.getHours()} ${a.getDate()} ${a.getMonth() + 1} *`, () => {
			client.channels.cache.find(channel => channel.id === meet._group).send(`${meet._name} meeting is started now.`);
			MeetingDbHandler.del(meet._group, meet._name)
				.then(console.log('del'))
				.catch(error => {console.log(error.response.data);});
			cronMeetings[meet._name].destroy();
		});
	}
	else {
		cronMeetings[meet._name] = cron.schedule(`${a.getSeconds()} ${a.getMinutes()} ${a.getHours()} ${a.getDate()} ${a.getMonth() + 1} *`, () => {
			client.channels.cache.find(channel => channel.id === meet._group).send(`${meet._name} meeting is started now.`);

			meet._date.setDate(a.getDate() + Number(meet._repeat));
			MeetingDbHandler.put(meet._group, meet._name, meet);
			startMeeting(meet);
		});

	}
}

function scheduleMeeting() {
	ServerDbHandler.get()
		.then(serverResponse => {
			for (const serverData of serverResponse.data) {
				GroupDbHandler.get(serverData.discordId)
					.then(groupResponse => {
						for(const groupData of groupResponse.data) {
							var group = new Group(groupData.discordId);
							group._serverId = groupData.serverDiscordId;
							startMeetingSchedule(group);
						}
					})
					.catch(error => {console.log(error.response.data);});
			}
		})
		.catch(error => {console.log(error.response.data);});
}


client.on('ready', () => {
	registerServer();
	console.log(`${client.user.tag} has loggged in.`);
	scheduleMeeting();
});

client.on('message', (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;

	const [CMD_NAME, ...args] = message.content
		.trim()
		.substring(PREFIX.length)
		.split(/\s/);
	switch(CMD_NAME) {
	case 'create':
		methodManager.create(message, args);
		break;
	case 'modify':
		methodManager.modify(message, args);
		break;
	case 'register':
		registerGroup(message);
		break;
	case 'statistic':
		getStatistic(message, args);
		break;
	case 'help':
		var embed = new MessageEmbed()
		// Set the title of the field
			.setTitle('Commands:')
		// Set the color of the embed
			.setColor(0xff0000)
		// Set the main content of the embed
			.addField('#register', 'Should be called by each member for registering.', false)
			.addField('#create project', 'params:\n ProjectName\n {Deadline}', true)
			.addField('#create subtask', 'params:\n ProjectName\n SubtaskName\n {Status, Weight, Deadline, AssignedPerson}', true)
			.addField('#create meeting', 'params:\n MeetingName\n Date\n {Deadline}', true)
			.addField('#modify project', 'params:\n ProjectName\n [name | deadline| status]\n Value', true)
			.addField('#modify subtask', 'params:\n ProjectName\n SubtaskName\n [name | status| weight| deadline| assign] Value', true)
			.addField('#modify meeting', 'params:\n MeetingName\n [name| date| repeat]\n Value', true)
			.addField('#delete project', 'params:\n ProjectName', true)
			.addField('#delete subtask', 'params:\n ProjectName\n SubtaskName', true)
			.addField('#delete meeting', 'params:\n MeetingName', true)
			.addField('#list project', 'params:\n ProjectName', true)
			.addField('#list subtask', 'params:\n ProjectName\n SubtaskName', true)
			.addField('#list meeting', 'params:\n MeetingName', true)
			.addField('#update', 'params:\n ProjectName \nSubtaskName', false)
			.addField('#statistic', 'params:\n ProjectName', false);
		// Send the embed to the same channel as the message
		message.channel.send(embed);
		break;
	case 'update':
		updateSubtaskStatus(message, args);
		break;
	case 'list':
		methodManager.list(message, args);
		break;
	case 'delete':
		methodManager.delete(message, args);
		break;
	default:
		message.channel.send(`No such command ${CMD_NAME}.`);
	}
});

client.login(process.env.DISCORDJS_BOT_TOKEN);