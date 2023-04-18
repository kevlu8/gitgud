const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { rating_to_number, rating_to_title } = require('../rating_helper.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Shows user information')
		.addMentionableOption(option => option.setName('username').setDescription('The user to get information about')),
	async execute(interaction) {
		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		let username = interaction.options.getMentionable('username');
		if (username === null) {
			var uid = interaction.user.id;
			if (users[uid] === undefined) {
				await interaction.reply('You have not linked your DMOJ account yet. Use `/link` to link your account.');
				return;
			}
			username = users[interaction.user.id];
		}
		else {
			var uid = username.id;
			if (users[uid] === undefined) {
				await interaction.reply('This user has not linked their DMOJ account yet.');
				return;
			}
			username = users[uid];
		}
		if (users[uid].rating > 2000) {
			const embed = new EmbedBuilder()
				.setTitle(username.username)
				.setColor(0x00AE86)
				.setURL(`https://dmoj.ca/user/${username.username}`)
				.setDescription('User information')
				.addFields(
					{ name: 'Rating', value: `${users[uid].rating.toString() + (users[uid].rating_deviation > 200 ? "?" : "")}`, inline: true },
					{ name: 'Rating deviation', value: users[uid].rating_deviation.toString(), inline: true},
					{ name: 'Title', value: rating_to_title(users[uid].rating) + `#${rating_to_number(users[uid].rating)}`, inline: true },
					{ name: 'gitgud count', value: users[uid].problem_cnt.toString(), inline: true },
					{ name: 'nogud count', value: users[uid].unsolved_cnt.toString(), inline: true },
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
			return;
		} else {
			const embed = new EmbedBuilder()
				.setTitle(username.username)
				.setColor(0x00AE86)
				.setURL(`https://dmoj.ca/user/${username.username}`)
				.setDescription('User information')
				.addFields(
					{ name: 'Rating', value: `${users[uid].rating.toString() + (users[uid].rating_deviation > 200 ? "?" : "")}`, inline: true },
					{ name: 'Rating deviation', value: users[uid].rating_deviation.toString(), inline: true},
					{ name: 'Title', value: rating_to_title(users[uid].rating), inline: true },
					{ name: 'gitgud count', value: users[uid].problem_cnt.toString(), inline: true },
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
			return;
		}
	}
};
