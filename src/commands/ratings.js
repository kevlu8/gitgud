const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ratings')
		.setDescription('Shows information about ratings'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Ratings')
			.setColor(0x00AE86)
			.setDescription('Information about ratings')
			.setTimestamp()
			.addFields(
				{ name: '0-999', value: 'Iron', inline: false },
				{ name: '1000-1199', value: 'Bronze', inline: false },
				{ name: '1200-1399', value: 'Silver', inline: false },
				{ name: '1400-1599', value: 'Gold', inline: false },
				{ name: '1600-1799', value: 'Platinum', inline: false },
				{ name: '1800-1999', value: 'Diamond', inline: false },
				{ name: '2000-2499', value: 'Master', inline: false },
				{ name: '2500-2999', value: 'Grandmaster', inline: false },
				{ name: '3000+', value: 'Immortal', inline: false },
			)
			.setFooter('Note: ratings above 2000 will have a number after them, indicating the user\'s global rank.');
		await interaction.reply({ embeds: [embed], ephemeral: true });
		return;
	}
};
