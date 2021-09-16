const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { version } = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Affiche la version du bot.'),
	async execute(interaction) {
		const emb = new MessageEmbed().setTitle('Version de Babot').setColor('#922222');
		emb.setDescription(version);
		await interaction.reply({ embeds: [emb] });
	},
};
