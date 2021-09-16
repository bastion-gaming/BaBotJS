const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { api } = require('../config.json');
const ge = require('../core/gestion');
const lvl = require('../core/level');

let desc = '';
let myName = '';
let dID = 0;
let palier = 0;
let sV = '';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Permet d\'avoir les informations d\'un utilisateur.')
		.addMentionableOption(option =>
			option.setName('nom')
				.setDescription('Mention de l\'utilisateur')),
	async execute(interaction) {
		const myUser = interaction.options.getMentionable('nom');
		if (myUser == null) {
			dID = interaction.user.id;
			myName = interaction.user.username;
		}
		else {
			dID = myUser.user.id;
			myName = myUser.user.username;
		}
		if (lvl.checkInfo(dID) == false) {
			await ge.addrole(myUser, 'Nouveau');
		}

		const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
		const { level, xp, nbmsg, nbreaction, godparent } = await fetch(`http://${api.ip}/users/${ID}`).then(response => response.json());
		const { godchilds } = await fetch(`http://${api.ip}/users/godchilds/${ID}`).then(response => response.json());
		const { nbgodchilds } = await fetch(`http://${api.ip}/users/godchilds/count/${ID}`).then(response => response.json());
		const { discord_id } = await fetch(`http://${api.ip}/users/${godparent}`).then(response => response.json());
		const parrain = interaction.guild.members.cache.find(user => user.id === discord_id);

		const emb = new MessageEmbed().setTitle('Informations')
			.setColor('#d1d7d8')
			.setDescription(`**Utilisateur:** ${myName}`);

		if (ge.guildID.includes(String(interaction.guildId))) {
			// Niveaux part
			palier = lvl.lvlPalier(level);
			desc = 'XP: `' + `${xp}/${palier}` + '`\n';
			desc += 'Messages: `' + `${nbmsg}` + '`\n';
			desc += 'Réactions: `' + `${nbreaction}` + '`\n';
			emb.addField(`**_Niveau_ : ${level}**`, desc);

			// Parrainage
			if (godparent != 0) {
				desc = `\nParrain: ${parrain.user}`;
			}
			else {
				desc = '\nParain: `None`';
			}
			if (nbgodchilds != 0) {
				if (nbgodchilds > 1) {
					sV = 's';
				}
				desc += `\nFilleul${sV} ` + '`' + `x${nbgodchilds}` + '`:';
				let godchildMember;
				for (const filleul of godchilds) {
					godchildMember = interaction.guild.members.cache.find(user => user.id === filleul['discord_id']);
					if (godchildMember != null) {
						desc += `\n${godchildMember}`;
					}
				}
			}
			emb.addField('**_Parrainage_**', desc);

			// Return
			await interaction.reply({ embeds: [emb] });
		}
		else {
			await interaction.reply('Commande utilisable uniquement sur le discord Bastion!');
		}
	},
};
