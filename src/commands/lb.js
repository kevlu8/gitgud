const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { rating_to_title } = require('../rating_helper.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gitgud')
		.setDescription('Recommends a problem for you to solve'),
	async execute(interaction) {
		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		let best = [];
		for (const [uid, user] of Object.entries(users)) {
			best.push({
				"username": user.username,
				"rating": user.rating,
				"gittengud": user.problem_cnt,
			});
		}
		best.sort((a, b) => {
			if (a.rating !== b.rating)
				return a.rating - b.rating;
			return a.gittengud - b.gittengud;
		});
		let embed = new EmbedBuilder()
			.setTitle('Leaderboard')
			.setColor(0x00AE86)
			.setDescription('Top 10 users')
			.setTimestamp();
		for (let i = 0; i < 10; i++) {
			if (best[i] === undefined) break;
			if (best[i].rating < 2000)
				embed.addFields({ name: `${i + 1}. ${best[i].username}`, value: `Rating: ${best[i].rating}\nTitle: ${rating_to_title(best[i].rating)}\nGitgud count: ${best[i].gittengud}`, inline: false });
			else
				embed.addFields({ name: `${i + 1}. ${best[i].username}`, value: `Rating: ${best[i].rating}?\nTitle: ${rating_to_title(best[i].rating)} #${i}\nGitgud count: ${best[i].gittengud}`, inline: false });
		}
		await interaction.reply({ embeds: [embed] });
		return;
	},
};
