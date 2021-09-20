const { SlashCommandBuilder } = require('@discordjs/builders');
const parrain = require('../core/parrain');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parrain')
		.setDescription('Parrainage')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Ajoute ton parrain')
				.addMentionableOption(option =>
					option
						.setName('tag')
						.setDescription('@Tag de ton parrain')
						.setRequired(true))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			const myparrain = interaction.options.getMentionable('tag');
			await parrain.add(interaction, interaction.member, myparrain);
		}
	},
};
