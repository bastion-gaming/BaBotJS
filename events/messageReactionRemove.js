const ge = require('../core/gestion');
const lvl = require('../core/level');

module.exports = {
	name: 'messageReactionRemove',
	async execute(reaction, user) {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			}
			catch (error) {
				console.error('Une erreur s\'est produite lors de la récupération du message:', error);
			}
		}
		const ID = user.id;
		const guild = reaction.message.guild;
		if (ge.guildID.includes(String(guild.id))) {
			await lvl.addxp(ID, -1);
			await lvl.addreaction(ID, -1);
		}
	},
};
