const ge = require('../core/gestion');
const lvl = require('../core/level');
const stats = require('../core/stats');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		let PREFIX_CHECK = false;
		for (const prefix of ge.prefixs) {
			if (message.content.indexOf(prefix) == 0) {
				PREFIX_CHECK = true;
			}
		}
		if (!PREFIX_CHECK) {
			try {
				if (ge.guildID.includes(String(message.guild.id))) {
					await lvl.xpmsg(message);
					await lvl.checklevel(message);
				}
				if (!message.author.bot) {
					await stats.add('msg');
				}
			}
			catch (error) {
				console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			}
		}
	},
};
