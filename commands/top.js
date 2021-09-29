const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { api } = require('../config.json');

const headers = {
	'access_token': api.key,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('top')
		.setDescription('Classements')
		.addSubcommand(subcommand =>
			subcommand
				.setName('msg')
				.setDescription('Affiche le classement en fonction du nombre de message')
				.addIntegerOption(option =>
					option.setName('range')
						.setDescription('Nombre d\'utilisateur à afficher')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('xp')
				.setDescription('Affiche le classement en fonction de l\'XP')
				.addIntegerOption(option =>
					option.setName('range')
						.setDescription('Nombre d\'utilisateur à afficher')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('reaction')
				.setDescription('Affiche le classement en fonction du nombre de réaction')
				.addIntegerOption(option =>
					option.setName('range')
						.setDescription('Nombre d\'utilisateur à afficher'))),
	async execute(interaction) {
		const range = interaction.options.getInteger('range');
		let adresse = '?skip=0';
		let title;
		let desc = '';
		if (range != null) {
			adresse += `&limit=${range}`;
		}
		else {
			adresse += '&limit=10';
		}
		if (interaction.options.getSubcommand() === 'msg') {
			adresse = `msg/${adresse}`;
			title = 'Classement en fonction des messages';
		}
		else if (interaction.options.getSubcommand() === 'reaction') {
			adresse = `reaction/${adresse}`;
			title = 'Classement en fonction des réactions';
		}
		else {
			adresse = `xp/${adresse}`;
			title = 'Classement en fonction de l\'XP';
		}
		const { top } = await fetch(`http://${api.ip}/infos/top/${adresse}`, { method: 'GET', headers: headers }).then(response => response.json());
		let j = 1;
		for (const user of top) {
			let name = '';
			try {
				name = interaction.guild.members.cache.find(myuser => myuser.id === user['discord_id']);
				if (name == null) {
					name = `<@${user['discord_id']}>`;
				}
			}
			catch (error) {
				name = `<@${user['discord_id']}>`;
			}
			if (interaction.options.getSubcommand() === 'msg') {
				desc += `${j} | ${name} _**${user['nbmsg']}**_ messages postés depuis le ${user['arrival']}\n`;
			}
			else if (interaction.options.getSubcommand() === 'reaction') {
				desc += `${j} | ${name} _**${user['nbreaction']}**_ réactions depuis le ${user['arrival']}\n`;
			}
			else {
				desc += `${j} | ${name} **${user['xp']}** XP • Niveau **${user['level']}**\n`;
			}
			if (j % 20 == 0) {
				const emb = new MessageEmbed()
					.setTitle(title)
					.setColor('#d1d7d8')
					.setDescription(desc);
				desc = '';
				if (j > 20) {
					await interaction.followUp({ embeds: [emb] });
				}
				else {
					await interaction.reply({ embeds: [emb] });
				}
			}
			j += 1;
		}
		if (desc != '') {
			const emb = new MessageEmbed()
				.setTitle(title)
				.setColor('#d1d7d8')
				.setDescription(desc);
			if (j > 20) {
				await interaction.followUp({ embeds: [emb] });
			}
			else {
				await interaction.reply({ embeds: [emb] });
			}
		}
	},
};
