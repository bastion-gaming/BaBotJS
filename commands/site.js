const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('site')
		.setDescription('Affiche le lien vers le site web.'),
	async execute(interaction) {
		await interaction.reply('https://www.bastion-gaming.fr');
	},
};
