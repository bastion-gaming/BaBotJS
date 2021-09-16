const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ge = require('../core/gestion');

const suppMax = 40;
let desc = '';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('supp')
		.setDescription('Supprime [nombre] de message dans le channel.')
		.addIntegerOption(option =>
			option.setName('nombre')
				.setDescription('Le nombre de message a supprimer')
				.setRequired(true)),
	async execute(interaction) {
		const nb = interaction.options.getInteger('nombre');
		if (ge.permission(interaction, ge.Inquisiteur)) {
			if (nb <= suppMax) {
				await interaction.channel.bulkDelete(nb);
				desc = `${nb} messages effacé !`;
			}
			else {
				desc = `On ne peut pas supprimer plus de ${suppMax} messages à la fois`;
			}
		}
		else {
			desc = 'Tu ne remplis pas les conditions, tu fais partie de la plèbe !';
		}
		const emb = new MessageEmbed().setTitle('Message de Babot').setColor('#922222');
		emb.setDescription(desc);
		await interaction.reply({ embeds: [emb] });
	},
};
