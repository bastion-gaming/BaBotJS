const wel = require('../core/welcome');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const systemchannel = member.guild.systemChannel;
		await wel.memberjoin(member, systemchannel);
	},
};
