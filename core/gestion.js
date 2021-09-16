// const ge = require('../core/gestion');
const fetch = require('node-fetch');
const { api } = require('../config.json');

const rolesID = [
	['417451897729843223'],
	['417451897729843223', '417451604141277185'],
	['417451897729843223', '417451604141277185', '677534823694336001', '423606460908306433'],
];

// guildID[0] = Bastion, guildID[1] = Test
const guildID = [
	'417445502641111051',
	'478003352551030796',
];

module.exports = {
	prefixs: ['!', '/', '*', '-', '§', '?'],
	guildID: guildID,
	rolesID: rolesID,
	admin: 0,
	Inquisiteur: 1,
	Joueurs: 2,

	bcolors: {
		'OK': '\033[92m',
		'WARNING': '\033[93m',
		'FAIL': '\033[91m',
		'RESET': '\033[0m',
	},

	permission: function(interaction, grade) {
		const roles = interaction.member.roles.cache;
		// console.log(roles);
		for (const role of roles) {
			if (rolesID[grade].includes(role[1].id) || (guildID.includes(String(interaction.guildId)) && role[1].permissions.serialize().ADMINISTRATOR)) {
				return true;
			}
		}
		return false;
	},

	nom_ID: function(nom) {
		let ID = -1;
		if (nom.length == 21) {
			ID = parseInt(nom.substring(2, 20));
		}
		else if (nom.length == 22) {
			ID = parseInt(nom.substring(3, 21));
		}
		else if (nom.length == 18) {
			ID = parseInt(nom);
		}
		return ID;
	},

	addrole: async function(member, role) {
		const setrole = member.guild.roles.cache.find(srole => srole.name === role);
		if (isNaN(setrole)) {
			// await console.log('Role introuvable');
			return false;
		}
		else {
			await member.roles.add(setrole);
			return true;
		}
	},

	removerole: async function(member, role) {
		const setrole = member.guild.roles.cache.find(srole => srole.name === role);
		if (isNaN(setrole)) {
			// await console.log('Role introuvable');
			return false;
		}
		else {
			await member.roles.remove(setrole);
			return true;
		}
	},

	PlayerIDtoDiscordID: async function(PlayerID) {
		const { discord_id } = await fetch(`http://${api.ip}/users/${PlayerID}`).then(response => response.json());
		return discord_id;
	},
};
