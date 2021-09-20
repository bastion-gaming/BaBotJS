const { api } = require('../config.json');
const { version } = require('../package.json');
const ge = require('../core/gestion');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Connecté avec le nom ${ge.bcolors.blueb}${client.user.username}${ge.bcolors.end} \nVersion ${ge.bcolors.green}${version}${ge.bcolors.end}`);
		console.log(`${ge.bcolors.blueb}${api.name}${ge.bcolors.end} ${ge.bcolors.green}${api.version}${ge.bcolors.end}`);
		console.log('------\n');
	},
};