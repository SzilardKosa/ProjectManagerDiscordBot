const Project = require('./type/project.js');
const axios = require('axios');
const web = 'http://localhost:5000/projects/groupId2/';

class database {
	Post(project) {
		axios.post(web, project.toJson()).then(resp => {
			console.log(resp.data);
		})
			.catch(error => {
				console.log(error.response.data);
			});
	}

	Get(projectID) {
		axios.get(web + projectID).then(resp => {

			console.log(resp.data);
		})
			.catch(error => {
				console.log(error.response.data);
			});
	}

	Put(project) {
		return project;
	}
}

const proj = new Project('a');
console.log(proj.toJson())
;
const database2 = new database();
database2.Post(proj);
module.exports = database;