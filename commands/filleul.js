const { SlashCommandBuilder } = require('@discordjs/builders');
const parrain = require('../core/parrain');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('filleul')
		.setDescription('Filleul')
		.addSubcommand(subcommand =>
			subcommand
				.setName('liste')
				.setDescription('Affiche la liste des filleuls de l\'utilisateur')
				.addMentionableOption(option =>
					option
						.setName('tag')
						.setDescription('@Tag d\'un utilisateur')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('supp')
				.setDescription('Supprime un de tes filleuls')
				.addMentionableOption(option =>
					option
						.setName('tag')
						.setDescription('@Tag de ton filleul')
						.setRequired(true))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'liste') {
			const tag = interaction.options.getMentionable('tag');
			if (tag != null) {
				await parrain.liste(interaction, tag);
			}
			else {
				await parrain.liste(interaction, interaction.member);
			}
		}
		else if (interaction.options.getSubcommand() === 'supp') {
			const tag = interaction.options.getMentionable('tag');
			await parrain.supp(interaction, tag);
		}

	},
};
