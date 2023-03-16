const fs = require('fs');
const ge = require('../core/gestion');

// ===============================================================
function fileExist(path) {
	fs.access(path, fs.F_OK, (error) => {
		if (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			return false;
		}
		return true;
	});
}

function format_date(format = 'FR') {
	let date_ob = new Date(Date.now());
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	if (String(month).length == 1) {
		month = `0${month}`;
	}
	if (format == 'FR') {
		return `${date}-${month}-${year}`;
	}
	else {
		return `${year}-${month}-${date}`;
	}
}

function fileData(path) {
	try {
		const data = fs.readFileSync(path, 'utf8');
		return JSON.parse(data);
	}
	catch (error) {
		console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
		return false;
	}
}

function fileWrite(path, data) {
	fs.writeFile(path, data, (error) => {
		if (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			return false;
		}
		return true;
	});
}

function fileDelete(path) {
	fs.unlink(path, (error => {
		if (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			return false;
		}
		return true;
	}));
}

// ===============================================================
module.exports = {
	exist: function(path) {
		return fileExist(path);
	},

	read: function(path) {
		return fileData(path);
	},

	write: function(path, data) {
		return fileWrite(path, data);
	},

	delete: function(path) {
		return fileDelete(path);
	},

	date: function() {
		return format_date();
	},
};
