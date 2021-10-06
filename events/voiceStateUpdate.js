const ge = require('../core/gestion');
const lvl = require('../core/level');

// ################################################
const on_vocal = {};
const on_cam = {};
const on_stream = {};
// ################################################

module.exports = {
	name: 'voiceStateUpdate',
	async execute(before, after) {
		// console.log(before);
		// console.log(after);
		const guild = before.guild;
		const member = before.member;
		const ID = member.user.id;
		try {
			if (ge.guildID.includes(String(guild.id))) {
				const afkchannel = guild.afkChannel;

				// Voice XP
				if (after.channel != null && !(member.user.username in on_vocal) && after.channel.id != afkchannel.id) {
					on_vocal[member.user.username] = Date.now();
					console.log(`[${ge.bcolors.greenb}+${ge.bcolors.end}] ${member.user.username} => ${after.channel.name}`);
				}
				else if ((after.channel == null || after.channel.id == afkchannel.id) && (member.user.username in on_vocal)) {
					const time_on = ~~(((Date.now() - on_vocal[member.user.username]) / 1000) / 60);
					console.log(`[${ge.bcolors.redb}-${ge.bcolors.end}] ${member.user.username} as passé ${ge.bcolors.yellow}${time_on}${ge.bcolors.end} minutes en ${ge.bcolors.yellow}vocal${ge.bcolors.end} !`);
					await lvl.addxp_voc(ID, time_on);
					await lvl.checklevelvocal(member);
					delete on_vocal[member.user.username];
				}

				// Caméra
				if (after.selfVideo && !(member.user.username in on_cam)) {
					on_cam[member.user.username] = Date.now();
					console.log(`[${ge.bcolors.greenb}+${ge.bcolors.end}] ${member.user.username} a allumé sa caméra`);
				}
				else if ((after.channel == null || !(after.selfVideo)) && (member.user.username in on_cam)) {
					const time_on_cam = ~~(((Date.now() - on_cam[member.user.username]) / 1000) / 60);
					console.log(`[${ge.bcolors.redb}-${ge.bcolors.end}] ${member.user.username} as passé ${ge.bcolors.yellow}${time_on_cam}${ge.bcolors.end} minutes avec la ${ge.bcolors.yellow}caméra allumée${ge.bcolors.end} !`);
					await lvl.addxp_voc(ID, time_on_cam);
					await lvl.checklevelvocal(member);
					delete on_cam[member.user.username];
				}

				// Partage vidéo
				if (after.streaming && !(member.user.username in on_stream)) {
					on_stream[member.user.username] = Date.now();
					console.log(`[${ge.bcolors.greenb}+${ge.bcolors.end}] ${member.user.username} a commencé un partage vidéo`);
				}
				else if ((after.channel == null || !(after.streaming)) && (member.user.username in on_stream)) {
					const time_on_stream = ~~(((Date.now() - on_stream[member.user.username]) / 1000) / 60);
					console.log(`[${ge.bcolors.redb}-${ge.bcolors.end}] ${member.user.username} as passé ${ge.bcolors.yellow}${time_on_stream}${ge.bcolors.end} minutes en ${ge.bcolors.yellow}partage vidéo${ge.bcolors.end} !`);
					await lvl.addxp_voc(ID, time_on_stream);
					await lvl.checklevelvocal(member);
					delete on_stream[member.user.username];
				}
			}
		}
		catch (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
		}
	},
};
