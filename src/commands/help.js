const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of all commands')
		.addStringOption(option => option.setName('command').setDescription('The command to get specific information about')),
	async execute(interaction) {
		const cmd = interaction.options.getString('command');
		if (cmd === null) {
			const embed = new EmbedBuilder()
				.setTitle('List of commands')
				.setColor(0x00AE86)
				.setDescription('List of all commands')
				.addFields(
					{ name: '/gitgud', value: 'Get a recommended problem from DMOJ, based on your rating' },
					{ name: '/gotgud', value: 'Let the bot know that you solved the gitgud problem' },
					{ name: '/help', value: 'List of all commands' },
					{ name: '/lb', value: 'Show the leaderboard for ratings' },
					{ name: '/link', value: 'Link your DMOJ account to your Discord account' },
					{ name: '/nogud', value: 'Let the bot know that you could not solve the gitgud problem' },
					{ name: '/unlink', value: 'Unlink your DMOJ account from your Discord account'},
					{ name: '/user', value: 'Shows user information' },
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		}
		else {
			let embed = new EmbedBuilder();
			if (cmd == "gitgud") {
				embed.setTitle('/gitgud')
					.setColor(0x00AE86)
					.setDescription('Get a recommended problem from DMOJ, based on your rating')
					.addFields(
						{ name: 'Usage', value: '/gitgud' },
					)
					.setTimestamp();
			}
			else if (cmd == "gotgud") {
				embed.setTitle('/gotgud')
					.setColor(0x00AE86)
					.setDescription('Let the bot know that you solved the gitgud problem')
					.addFields(
						{ name: 'Usage', value: '/gotgud' },
					)
					.setTimestamp();
			}
			else if (cmd == "help") {
				embed.setTitle('/help')
					.setColor(0x00AE86)
					.setDescription('List of all commands')
					.addFields(
						{ name: 'Usage', value: '/help' },
					)
					.setTimestamp();
			}
			else if (cmd == "lb") {
				embed.setTitle('/lb')
					.setColor(0x00AE86)
					.setDescription('Show the leaderboard for ratings')
					.addFields(
						{ name: 'Usage', value: '/lb' },
					)
					.setTimestamp();
			}
			else if (cmd == "link") {
				embed.setTitle('/link')
					.setColor(0x00AE86)
					.setDescription('Link your DMOJ account')
					.addFields(
						{ name: 'Usage', value: '/link <dmoj username>' },
					)
					.setTimestamp();
			}
			else if (cmd == "nogud") {
				embed.setTitle('/nogud')
					.setColor(0x00AE86)
					.setDescription('Let the bot know that you could not solve the gitgud problem')
					.addFields(
						{ name: 'Usage', value: '/nogud' },
					)
					.setTimestamp();
			}
			else if (cmd == "unlink") {
				embed.setTitle('/unlink')
					.setColor(0x00AE86)
					.setDescription('Unlink your DMOJ account')
					.addFields(
						{ name: 'Usage', value: '/unlink' },
					)
					.setTimestamp();
			}
			else if (cmd == "user") {
				embed.setTitle('/user')
					.setColor(0x00AE86)
					.setDescription('Shows user information')
					.addFields(
						{ name: 'Usage', value: '/user <@user>' },
					)
					.setTimestamp();
			}
			else {
				embed.setTitle('Error')
					.setColor(0x00AE86)
					.setDescription('Command not found')
					.setTimestamp();
			}
			await interaction.reply({ embeds: [embed] });
		}
	},
};
