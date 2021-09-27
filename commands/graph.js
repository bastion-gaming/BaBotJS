const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { api } = require('../config.json');

const headers = {
	'access_token': api.key,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('graph')
		.setDescription('Graphique')
		.addSubcommand(subcommand =>
			subcommand
				.setName('xp')
				.setDescription('Graphique en fonction de l\'XP')
				.addIntegerOption(option =>
					option.setName('range')
						.setDescription('Nombre d\'utilisateur a affiché sur le graphique')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('msg')
				.setDescription('Graphique en fonction du nombre de messages écrit')
				.addIntegerOption(option =>
					option.setName('range')
						.setDescription('Nombre d\'utilisateur a affiché sur le graphique')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('hour')
				.setDescription('Graphique en fonction des heures'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('day')
				.setDescription('Graphique en fonction des jours')),
	async execute(interaction) {
		let range = interaction.options.getInteger('range');
		const channelid = interaction.channel.id;
		const guildid = interaction.guild.id;
		let desc = '';
		if (range == null) {
			range = 6;
		}
		if (interaction.options.getSubcommand() === 'xp') {
			desc = 'de l\'XP';
			await fetch(`http://${api.ip}/stats/xp/graph/?guildid=${guildid}&channelid=${channelid}&range=${range}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		else if (interaction.options.getSubcommand() === 'msg') {
			desc = 'des messages';
			await fetch(`http://${api.ip}/stats/msg/graph/?guildid=${guildid}&channelid=${channelid}&range=${range}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		else if (interaction.options.getSubcommand() === 'hour') {
			await fetch(`http://${api.ip}/stats/msg/hour/graph/?guildid=${guildid}&channelid=${channelid}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		else if (interaction.options.getSubcommand() === 'day') {
			await fetch(`http://${api.ip}/stats/msg/day/graph/?guildid=${guildid}&channelid=${channelid}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		await interaction.reply(`Graphique ${desc}`);
	},
};
