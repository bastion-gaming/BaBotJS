const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { api } = require('../config.json');
const ge = require('../core/gestion');

const headers = {
	'access_token': api.key,
};

async function addxp(dID, nb) {
	const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
	await fetch(`http://${api.ip}/users/xp/${ID}/${nb}`, { method: 'PUT', headers: headers }).then(response => response.json());
	// console.log(`xp add ${nb}`);
}

async function addmsg(dID, nb) {
	const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
	await fetch(`http://${api.ip}/users/msg/${ID}/${nb}`, { method: 'PUT', headers: headers }).then(response => response.json());
	// console.log(`msg add ${nb}`);
}

async function addreaction(dID, nb) {
	const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
	await fetch(`http://${api.ip}/users/reaction/${ID}/${nb}`, { method: 'PUT', headers: headers }).then(response => response.json());
	// console.log(`reaction add ${nb}`);
}

function lvlPalier(lvl) {
	if (lvl <= 0) {
		return 10;
	}
	else {
		const palier = ~~(30 * (lvl) ** (2.5));
		return palier;
	}
}

async function checkInfo(dID) {
	const { error } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
	if (error == 404) {
		await fetch(`http://${api.ip}/users/create/?discord_id=${dID}`, { method: 'POST', headers: headers }).then(response => response.json());
		return false;
	}
	return true;
}

module.exports = {
	addxp: async function(dID, nb) {
		await addxp(dID, nb);
	},

	addmsg: async function(dID, nb) {
		await addmsg(dID, nb);
	},

	addreaction: async function(dID, nb) {
		await addreaction(dID, nb);
	},

	lvlPalier: function(lvl) {
		return lvlPalier(lvl);
	},

	checkInfo: async function(dID) {
		await checkInfo(dID);
	},

	xpmsg: async function(message) {
		const ID = message.author.id;
		// checkInfo(ID);
		if (!message.mentions.everyone) {
			const lw = message.content.split(' ');
			let nb = ~~(lw.length / 15) + 1;
			if (nb <= 0) {
				nb = 1;
			}
			else if (nb > 6) {
				nb = 6;
			}
			await addxp(ID, nb);
		}
		else {
			await addxp(ID, 1);
		}
		await addmsg(ID, 1);
		return true;
	},

	addxp_voc: async function(dID, time) {
		let xp = 0;
		let retime = 0;
		if (time <= 240) {
			xp = ~~(time);
		}
		else {
			retime = ~~((time - 240) / 2);
			if (retime <= 30) {
				xp = 240 + retime;
			}
			else {
				retime = ~~((retime - 30) / 4);
				xp = 270 + retime;
			}
		}
		await addxp(dID, xp);
	},

	checklevel: async function(message) {
		const dID = message.member.id;
		const Nom = message.member.displayName;
		const member = message.member;
		try {
			const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
			const { xp } = await fetch(`http://${api.ip}/users/xp/${ID}`).then(response => response.json());
			const { level } = await fetch(`http://${api.ip}/users/level/${ID}`).then(response => response.json());
			let lvl2 = level;
			const palier = lvlPalier(level);
			// console.log(`XP: ${xp}, Level: ${level}`);
			// console.log(xp >= palier);
			if (xp >= palier) {
				fetch(`http://${api.ip}/users/level/${ID}/1`, { method: 'PUT', headers: headers }).then(response => response.json());
				lvl2 = level + 1;
				const desc = `:tada: ${Nom} a atteint le niveau **${level + 1}**`;
				const title = 'Level UP';
				const msgEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(title)
					.setDescription(desc)
					.setThumbnail(message.author.defaultAvatarURL);

				await message.channel.send({ embeds: [msgEmbed] });
			}
			if (level == 0 && lvl2 == 1) {
				await ge.addrole(member, 'Joueurs');
				await ge.removerole(member, 'Nouveau');
			}
			return true;
		}
		catch (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			await checkInfo(dID);
		}
	},

	checklevelvocal: async function(member) {
		const dID = member.user.id;
		const Nom = member.user.username;
		try {
			const channel_vocal = member.guild.channels.cache.get(507679074362064916);
			const { ID } = await fetch(`http://${api.ip}/users/playerid/${dID}`).then(response => response.json());
			const { xp } = await fetch(`http://${api.ip}/users/xp/${ID}`).then(response => response.json());
			const { level } = await fetch(`http://${api.ip}/users/level/${ID}`).then(response => response.json());
			let lvl2 = level;
			const palier = lvlPalier(level);
			if (xp >= palier) {
				fetch(`http://${api.ip}/users/level/${ID}/1`, { method: 'PUT', headers: headers }).then(response => response.json());
				lvl2 = level + 1;
				const desc = `:tada: ${Nom} a atteint le niveau **${level + 1}**`;
				const title = 'Level UP';
				const msgEmbed = new MessageEmbed()
					.setColor('#6466585')
					.setTitle(title)
					.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
					.setDescription(desc)
					.setThumbnail(member.user.defaultAvatarURL);

				await channel_vocal.send({ embeds: [msgEmbed] });
			}
			if (level == 0 && lvl2 == 1) {
				await ge.addrole(member, 'Joueurs');
				await ge.removerole(member, 'Nouveau');
			}
			return true;
		}
		catch (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
			await checkInfo(dID);
		}
	},
};
