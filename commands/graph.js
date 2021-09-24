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
						.setDescription('Nombre d\'utilisateur a affiché sur le graphique')
						.addChoice('1', 1)
						.addChoice('6', 6)
						.addChoice('12', 12)
						.addChoice('24', 24)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('msg')
				.setDescription('Graphique en fonction du nombre de messages écrit')
				.addIntegerOption(option =>
					option.setName('range')
						.setDescription('Nombre d\'utilisateur a affiché sur le graphique')
						.addChoice('1', 1)
						.addChoice('6', 6)
						.addChoice('12', 12)
						.addChoice('24', 24)))
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
		if (range == null) {
			range = 6;
		}
		if (interaction.options.getSubcommand() === 'xp') {
			await fetch(`http://${api.ip}/stats/xp/graph/?guildid=${guildid}&channelid=${channelid}&range=${range}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		else if (interaction.options.getSubcommand() === 'msg') {
			await fetch(`http://${api.ip}/stats/msg/graph/?guildid=${guildid}&channelid=${channelid}&range=${range}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		else if (interaction.options.getSubcommand() === 'hour') {
			await fetch(`http://${api.ip}/stats/msg/hour/graph/?guildid=${guildid}&channelid=${channelid}&range=${range}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		else if (interaction.options.getSubcommand() === 'day') {
			await fetch(`http://${api.ip}/stats/msg/day/graph/?guildid=${guildid}&channelid=${channelid}&range=${range}`, { method: 'GET', headers: headers }).then(response => response.json());
		}
		await interaction.reply('Graphique');
	},
};
