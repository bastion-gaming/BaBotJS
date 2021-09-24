const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { api } = require('../config.json');

const headers = {
	'access_token': api.key,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Statistiques')
		.addSubcommand(subcommand =>
			subcommand
				.setName('hour')
				.setDescription('Nombre de message ecrit pendant la tranche horaire sélectionnée')
				.addIntegerOption(option =>
					option.setName('début')
						.setDescription('Heure du début de la plage horaire'))
				.addIntegerOption(option =>
					option.setName('fin')
						.setDescription('Heure de fin de la plage horaire'))),
	async execute(interaction) {
		const start = interaction.options.getInteger('début');
		const stop = interaction.options.getInteger('fin');
		const channelid = interaction.channel.id;
		const guildid = interaction.guild.id;
		let adresse = `?guildid=${guildid}&channelid=${channelid}`;
		if (start != null && stop != null) {
			adresse += `&skip=${start}&limit=${stop}`;
		}
		else if (start != null && stop == null) {
			adresse += `&skip=${start}`;
		}
		else if (start == null && stop != null) {
			adresse += `&limit=${stop}`;
		}
		if (interaction.options.getSubcommand() === 'hour') {
			const { msghour } = await fetch(`http://${api.ip}/stats/msg/hour/${adresse}`, { method: 'GET', headers: headers }).then(response => response.json());
			await interaction.reply(msghour);
		}
	},
};
