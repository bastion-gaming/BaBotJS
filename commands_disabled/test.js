const { SlashCommandBuilder } = require('@discordjs/builders');
// const ge = require('../core/gestion');
const wel = require('../core/welcome');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction) {
		console.log('test');
		await interaction.reply('Ceci est un test');
		await wel.memberremove(interaction.member, interaction.guild.systemChannel);
	},
};
