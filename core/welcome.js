const fetch = require('node-fetch');
const { api } = require('../config.json');
const ge = require('../core/gestion');

const headers = {
	'access_token': api.key,
};

module.exports = {
	memberjoin: async function(member, channel) {
		if (member.guild.id == ge.guildID[0]) {
			const channel_regle = member.guild.rulesChannel;
			const dID = member.id;
			const { error } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
			if (error == 404) {
				fetch(`http://${api.ip}/users/create/?discord_id=${dID}`, { method: 'POST', headers: headers }).then(response => response.json());
				let msg = `:blue_square: Bienvenue ${member.user.username} sur Bastion! :blue_square: \nNous sommes ravis que tu aies rejoint notre communauté !`;
				msg += `\n\nMerci de lire les règles et le fonctionnement du serveur dans le salon ${channel_regle.name}`;
				msg += '\nAjoute aussi ton parrain avec `!parrain @pseudo`\n▬▬▬▬▬▬▬▬▬▬▬▬';
			}
			else {
				const msg = `▬▬▬▬▬▬ Bon retour parmis nous ! ${member.user.username} ▬▬▬▬▬▬`;
			}
			await ge.addrole(member, 'Nouveau');
			await channel.send(msg);
		}
		else {
			let msg = `:blue_square: Bienvenue ${member.user.username} sur ${member.guild.name}! :blue_square:`;
			msg += '\nAjoute aussi ton parrain avec `!parrain @pseudo`\n▬▬▬▬▬▬▬▬▬▬▬▬';
			await channel.send(msg);
		}
	},

	memberremove: async function(member, channel) {
		const dID = member.id;
		if (member.guild.id == ge.guildID[0]) {
			try {
				const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
				const { xp } = await fetch(`http://${api.ip}/users/xp/${ID}`).then(response => response.json());
				const { level } = await fetch(`http://${api.ip}/users/level/${ID}`).then(response => response.json());

				fetch(`http://${api.ip}/users/xp/${ID}/${-xp}`, { method: 'PUT', headers: headers }).then(response => response.json());
				fetch(`http://${api.ip}/users/level/${ID}/${-level}`, { method: 'PUT', headers: headers }).then(response => response.json());
			}
			catch (error) {
				console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			}
		}

		const msg = `**${member.user.username}** nous a quitté, pourtant si jeune...`;
		await channel.send(msg);
	},
};
