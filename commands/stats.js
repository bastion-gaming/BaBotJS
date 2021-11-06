const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
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
				.setName('heure')
				.setDescription('Nombre de message ecrit pendant la tranche horaire sélectionnée')
				.addIntegerOption(option =>
					option.setName('début')
						.setDescription('Heure du début de la plage horaire'))
				.addIntegerOption(option =>
					option.setName('fin')
						.setDescription('Heure de fin de la plage horaire')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('mois')
				.setDescription('Affiche les statistiques du mois sélectionné')
				.addIntegerOption(option =>
					option.setName('mois')
						.setDescription('Sélection du mois')
						.setRequired(true)
						.addChoice('Janvier', 1)
						.addChoice('Février', 2)
						.addChoice('Mars', 3)
						.addChoice('Avril', 4)
						.addChoice('Mai', 5)
						.addChoice('Juin', 6)
						.addChoice('Juillet', 7)
						.addChoice('Août', 8)
						.addChoice('Septembre', 9)
						.addChoice('Octobre', 10)
						.addChoice('Novembre', 11)
						.addChoice('Décembre', 12))
				.addIntegerOption(option =>
					option.setName('année')
						.setDescription('Sélection de l\'année'))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'heure') {
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
			const { msghour } = await fetch(`http://${api.ip}/stats/msg/hour/${adresse}`, { method: 'GET', headers: headers }).then(response => response.json());
			await interaction.reply(msghour);
		}
		else if (interaction.options.getSubcommand() === 'mois') {
			const choise_mois = interaction.options.getInteger('mois');
			const choise_année = interaction.options.getInteger('année');
			let adresse;
			if (choise_année == null) {
				adresse = `?mois=${choise_mois}&annee=0`;
			}
			else {
				adresse = `?mois=${choise_mois}&annee=${choise_année}`;
			}
			const { error, mois } = await fetch(`http://${api.ip}/stats/mois/${adresse}`, { method: 'GET', headers: headers }).then(response => response.json());
			if (error == 1) {
				await interaction.reply(mois);
			}
			else {
				let emb = new MessageEmbed().setTitle('Statistiques du mois')
					.setColor('#d1d7d8');
				let j = 1;
				const jmax = 14;
				let check = 0;
				for (const date of mois) {
					emb.addField(`${date.date}`, `Messages: ${date.msg}\nRéactions: ${date.reaction}`);
					check = 1;
					if (j % jmax == 0) {
						if (j > jmax) {
							await interaction.followUp({ embeds: [emb] });
						}
						else {
							await interaction.reply({ embeds: [emb] });
						}
						emb = new MessageEmbed().setTitle('Statistiques du mois')
							.setColor('#d1d7d8');
						check = 0;
					}
					j += 1;
				}
				if (check == 1) {
					if (j > jmax) {
						await interaction.followUp({ embeds: [emb] });
					}
					else {
						await interaction.reply({ embeds: [emb] });
					}
				}
			}
		}
	},
};
