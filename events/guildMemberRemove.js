const wel = require('../core/welcome');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		const systemchannel = member.guild.systemChannel;
		await wel.memberremove(member, systemchannel);
	},
};
