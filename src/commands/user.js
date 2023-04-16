const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { update_rating, rating_to_title, titles } = require('../rating_helper.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Shows user information')
		.addStringOption(option => option.setName('username').setDescription('DMOJ username')),
	async execute(interaction) {
		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		let username = interaction.options.getString('username');
		const uid = interaction.user.id;
		if (username === null) {
			if (users[uid] === undefined) {
				await interaction.reply('You have not linked your DMOJ account yet. Use `/link` to link your account.');
				return;
			}
			username = users[interaction.user.id];
		}
		const embed = new EmbedBuilder()
			.setTitle(username.username)
			.setColor(0x00AE86)
			.setURL(`https://dmoj.ca/user/${username.username}`)
			.setDescription('User information')
			.addFields(
				{ name: 'Rating', value: users[uid].rating.toString(), inline: true },
				{ name: 'Title', value: rating_to_title(users[uid].rating), inline: true },
			)
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
		return;
	}
};
