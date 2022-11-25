const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pong')
		.setDescription('A nie przypadkiem ping?'),
	async execute(interaction) {
		await interaction.reply('Coś ci się pomyliło! Spróbuj użyć ping!');
	},
};