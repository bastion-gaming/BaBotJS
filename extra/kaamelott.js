const { MessageEmbed } = require('discord.js');
const ge = require('../core/gestion');
const json = require('../extra/citation.json');


module.exports = {
	personnages: function() {
		// Liste des personnages de Kaamelott ayant une citation
		const keys = Object.keys(json).sort();
		let desc = '';
		for (const key in keys) {
			desc += `• ${keys[key]}\n`;
		}
		const emb = new MessageEmbed().setTitle('Liste des personnages').setColor('#922222');
		emb.setDescription(desc);
		return ({ embeds: [emb] });
	},

	citation: function(auteur) {
		let auteur_c = '';
		let random_p = 0;
		let random_c = 0;
		let citation = '';
		const keys = Object.keys(json).sort();
		if (auteur == null || auteur == '') {
			const size = Object.keys(json).length;
			random_p = Math.floor(Math.random() * size);
			auteur_c = keys[random_p];
			random_c = Math.floor(Math.random() * json[auteur_c].length);
			citation = json[auteur_c][random_c];
		}
		else {
			auteur_c = auteur.toLowerCase();
			try {
				random_c = Math.floor(Math.random() * json[auteur_c].length);
				citation = json[auteur_c][random_c];
			}
			catch (error) {
				console.log(`${ge.bcolors.redb}${error}${ge.bcolors.end}`);
				return 'Le nom de l\'auteur est mal rempli';
			}
		}
		const emb = new MessageEmbed().setTitle(`Citation de _${auteur_c}_`).setColor('#922222');
		emb.setDescription(citation);
		emb.setAuthor('Module Extra: Kaamelott');
		return ({ embeds: [emb] });
	},
};
