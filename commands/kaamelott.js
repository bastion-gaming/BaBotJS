const { SlashCommandBuilder } = require('@discordjs/builders');
const kaamelott = require('../extra/kaamelott');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kaamelott')
		.setDescription('Kaamelott')
		.addSubcommand(subcommand =>
			subcommand
				.setName('personnages')
				.setDescription('Liste des personnages de Kaamelott ayant une citation'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('citation')
				.setDescription('Donne une citation random ou d\'un personnage en particulier')
				.addStringOption(option =>
					option.setName('auteur')
						.setDescription('auteur de la citation'))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'personnages') {
			await interaction.reply(kaamelott.personnages());
		}
		else if (interaction.options.getSubcommand() === 'citation') {
			const auteur = interaction.options.getString('auteur');
			await interaction.reply(kaamelott.citation(auteur));
		}
	},
};
