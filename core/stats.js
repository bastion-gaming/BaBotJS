// const stats = require('../core/stats');
const fetch = require('node-fetch');
const { api } = require('../config.json');
const file = require('../core/file');

const headers = {
	'access_token': api.key,
};

const stats_template = {
	'date': '0001-01-01',
	'start': 0,
	'stop': 0,
	'nbmsg': 0,
	'nbreaction': 0,
};

// ===============================================================
async function update_stats(type) {
	const path = 'cache/stats.json';
	const data = file.read(path);
	await fetch(`http://${api.ip}/stats/create/hour/?date=${data.date}&hourA=${data.start}&hourB=${data.stop}&nbmsg=${data.nbmsg}&nbreaction=${data.nbreaction}`, { method: 'PUT', headers: headers }).then(response => response.json());
	create_stats(type);
}

function create_stats(type) {
	const path = 'cache/stats.json';
	let data = stats_template;
	let date_ob = new Date(Date.now());
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	const hour = date_ob.getHours();
	if (String(month).length == 1) {
		month = `0${month}`;
	}
	data.date = `${year}-${month}-${date}`;
	data.start = hour;
	data.stop = hour + 1;
	if (type == 'msg') {
		data.nbmsg = data.nbmsg + 1;
	}
	else if (type == 'reaction') {
		data.nbreaction = data.nbreaction + 1;
	}
	return file.write(path, JSON.stringify(data));
}

async function add_stats(type) {
	const path = 'cache/stats.json';
	let data = file.read(path);
	let date_ob = new Date(Date.now());
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	const hour = date_ob.getHours();
	if (String(month).length == 1) {
		month = `0${month}`;
	}
	const Fulldate = `${year}-${month}-${date}`;

	if (!data) {
		create_stats(type);
	}
	else if (data.date == Fulldate && data.start == hour) {
		if (type == 'msg') {
			data.nbmsg = data.nbmsg + 1;
		}
		else if (type == 'reaction') {
			data.nbreaction = data.nbreaction + 1;
		}
		file.write(path, JSON.stringify(data));
	}
	else {
		await update_stats(type);
	}
}

// ===============================================================
module.exports = {
	template: stats_template,

	update: async function() {
		await update_stats();
	},

	create: async function() {
		await create_stats();
	},

	add: async function(type) {
		await add_stats(type);
	},
};
