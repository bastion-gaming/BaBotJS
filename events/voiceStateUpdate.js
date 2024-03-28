const ge = require('../core/gestion');
const lvl = require('../core/level');

// ################################################
const on_vocal = {};
const on_cam = {};
const on_stream = {};
const on_mute = {};
const var_time_mute = 45;
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
				let timember, mytime;
				timember = new Date();
				mytime = `${timember.getDay()} ${timember.getMonth()} ${timember.getFullYear()} | ${timember.getHours()}:${timember.getMinutes()}:${~~(timember.getMilliseconds() / 10)} |`;

				// Voice XP
				if (after.channel != null && !(member.user.username in on_vocal) && after.channel.id != afkchannel.id) {
					on_vocal[member.user.username] = Date.now();
					console.log(`${ge.bcolors.greenb}+${ge.bcolors.end} ${mytime} ${member.user.username} => ${after.channel.name}`);
				}
				else if ((after.channel == null || after.channel.id == afkchannel.id) && (member.user.username in on_vocal)) {
					let time_on = ~~(((Date.now() - on_vocal[member.user.username]) / 1000) / 60);
					const time_on_mem = time_on;
					try {
						const time_mute = ~~(((Date.now() - on_mute[member.user.username]) / 1000) / 60) - var_time_mute;
						if (time_mute > 0) {time_on = time_on - time_mute;}
					}
					catch (error) {
						console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
					}
					if (time_on != time_on_mem) {
						console.log(`${ge.bcolors.redb}-${ge.bcolors.end} ${mytime} ${member.user.username} as passé ${ge.bcolors.yellow}${time_on_mem}${ge.bcolors.end} minutes en ${ge.bcolors.yellow}vocal${ge.bcolors.end} avec ${ge.bcolors.yellow}${time_on}${ge.bcolors.end} minutes comptabilisé !`);
					}
					else {
						console.log(`${ge.bcolors.redb}-${ge.bcolors.end} ${mytime} ${member.user.username} as passé ${ge.bcolors.yellow}${time_on_mem}${ge.bcolors.end} minutes en ${ge.bcolors.yellow}vocal${ge.bcolors.end} !`);
					}
					await lvl.addxp_voc(ID, time_on);
					await lvl.checklevelvocal(member);
					delete on_vocal[member.user.username];
					try {
						delete on_mute[member.user.username];
					}
					catch (error) {
						console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
					}
				}

				// Caméra
				if (after.selfVideo && !(member.user.username in on_cam)) {
					on_cam[member.user.username] = Date.now();
					console.log(`${ge.bcolors.greenb}+${ge.bcolors.end} ${mytime} ${member.user.username} a allumé sa caméra`);
				}
				else if ((after.channel == null || !(after.selfVideo)) && (member.user.username in on_cam)) {
					const time_on_cam = ~~(((Date.now() - on_cam[member.user.username]) / 1000) / 60);
					console.log(`${ge.bcolors.redb}-${ge.bcolors.end} ${mytime} ${member.user.username} as passé ${ge.bcolors.yellow}${time_on_cam}${ge.bcolors.end} minutes avec la ${ge.bcolors.yellow}caméra allumée${ge.bcolors.end} !`);
					await lvl.addxp_voc(ID, time_on_cam);
					await lvl.checklevelvocal(member);
					delete on_cam[member.user.username];
				}

				// Partage vidéo
				if (after.streaming && !(member.user.username in on_stream)) {
					on_stream[member.user.username] = Date.now();
					console.log(`${ge.bcolors.greenb}+${ge.bcolors.end} ${mytime} ${member.user.username} a commencé un partage vidéo`);
				}
				else if ((after.channel == null || !(after.streaming)) && (member.user.username in on_stream)) {
					const time_on_stream = ~~(((Date.now() - on_stream[member.user.username]) / 1000) / 60);
					console.log(`${ge.bcolors.redb}-${ge.bcolors.end} ${mytime} ${member.user.username} as passé ${ge.bcolors.yellow}${time_on_stream}${ge.bcolors.end} minutes en ${ge.bcolors.yellow}partage vidéo${ge.bcolors.end} !`);
					await lvl.addxp_voc(ID, time_on_stream);
					await lvl.checklevelvocal(member);
					delete on_stream[member.user.username];
				}

				// Member mute
				if ((after.selfDeaf && !after.serverMute) && !(member.user.username in on_mute)) {
					on_mute[member.user.username] = Date.now();
					console.log(`${ge.bcolors.redb}!${ge.bcolors.end} ${mytime} ${member.user.username} est sourd`);
				}
				else if ((after.channel == null || !(after.selfDeaf)) && (member.user.username in on_mute)) {
					let time_on = ~~(((Date.now() - on_vocal[member.user.username]) / 1000) / 60);
					try {
						const time_mute = ~~(((Date.now() - on_mute[member.user.username]) / 1000) / 60) - var_time_mute;
						if (time_mute > 0) {time_on = time_on - time_mute;}
					}
					catch (error) {
						console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
					}
					if (time_on > 0) {
						console.log(`${ge.bcolors.greenb}√${ge.bcolors.end} ${mytime} ${member.user.username} n'est plus sourd et a comptabilisé ${ge.bcolors.yellow}${time_on}${ge.bcolors.end} minutes en ${ge.bcolors.yellow}vocal${ge.bcolors.end} !`);
						await lvl.addxp_voc(ID, time_on);
						await lvl.checklevelvocal(member);
						on_vocal[member.user.username] = Date.now();
					}
					else {console.log(`${ge.bcolors.greenb}√${ge.bcolors.end} ${mytime} ${member.user.username} n'est plus sourd`);}
					delete on_mute[member.user.username];
				}
			}
		}
		catch (error) {
			console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
		}
	},
};
