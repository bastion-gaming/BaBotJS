const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { api } = require('../config.json');
const ge = require('../core/gestion');
const lvl = require('../core/level');

const headers = {
	'access_token': api.key,
};


module.exports = {
	add: async function(interaction, member, parrain) {
		// Permet d'ajouter un joueur comme parrain.
		// En le faisant vous touchez un bonus et lui aussi
		let desc = '';
		const dID = member.user.id;
		const dID_p = parrain.user.id;
		const PlayerID = await ge.getPlayerID(dID);
		const PlayerID_p = await ge.getPlayerID(dID_p);
		const { godparent } = await fetch(`http://${api.ip}/users/${PlayerID}`).then(response => response.json());
		if (PlayerID_p != 0 && godparent == 0 && dID != dID_p) {
			await fetch(`http://${api.ip}/users/${PlayerID}/godparent/${PlayerID_p}`, { method: 'PUT', headers: headers }).then(response => response.json());
			console.log('parrain ajouté');
			await lvl.addxp(PlayerID, 15);
			const { nbgodchilds } = await fetch(`http://${api.ip}/users/godchilds/count/${PlayerID}`).then(response => response.json());
			const gain_p = 100 * nbgodchilds;
			await lvl.addxp(PlayerID_p, gain_p);
			desc = `Votre parrain a bien été ajouté ! Vous empochez 15 XP et lui ${gain_p} XP.`;
		}
		else {
			desc = 'Impossible d\'ajouter ce joueur comme parrain';
		}
		await interaction.reply(desc);
	},

	liste: async function(interaction, member) {
		let desc = '';
		let sV = '';
		const { ID } = await fetch(`http://${api.ip}/users/playerid/${member.user.id}`).then(response => response.json());
		const { nbgodchilds } = await fetch(`http://${api.ip}/users/godchilds/count/${ID}`).then(response => response.json());
		const { godchilds } = await fetch(`http://${api.ip}/users/godchilds/${ID}`).then(response => response.json());
		if (nbgodchilds > 1) {
			sV = 's';
		}
		let godchildMember;
		for (const filleul of godchilds) {
			godchildMember = member.guild.members.cache.find(user => user.id === filleul['discord_id']);
			if (godchildMember != null) {
				desc += `\n${godchildMember}`;
			}
		}
		if (desc == '') {
			desc = 'Aucun filleul';
		}
		const emb = new MessageEmbed().setTitle(`Filleul${sV} de ${member.user.username}`).setColor('#d1d7d8');
		emb.setDescription(desc);
		await interaction.reply({ embeds: [emb] });
	},

	supp: async function(interaction, filleul) {
		let desc = '';
		const PlayerID = await ge.getPlayerID(interaction.member.user.id);
		const PlayerID_f = await ge.getPlayerID(filleul.user.id);
		const { godparent } = await fetch(`http://${api.ip}/users/${PlayerID_f}`).then(response => response.json());
		if (godparent == 0) {
			desc = 'Ce joueur n\'a pas de parrain';
		}
		else if (godparent == PlayerID) {
			await lvl.addxp(PlayerID_f, -15);
			const { nbgodchilds } = await fetch(`http://${api.ip}/users/godchilds/count/${PlayerID}`).then(response => response.json());
			const gain_p = 100 * nbgodchilds;
			await lvl.addxp(PlayerID, -gain_p);
			desc = `Votre filleul ${filleul} a bien été retiré ! Vous perdez ${gain_p} XP et lui 15 XP.`;
		}
		else {
			desc = 'Vous n\'etes pas son parrain !';
		}
		await interaction.reply(desc);
	},
};
