const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { rating_to_points, point_ranges } = require('../rating_helper.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gitgud')
		.setDescription('Recommends a problem for you to solve'),
	async execute(interaction) {
		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		const uid = interaction.user.id;
		if (!users[uid]) {
			await interaction.reply('You are not linked to any DMOJ account', { ephemeral: true });
			return;
		}
		const curr_prob = users[uid].current_problem;
		if (curr_prob) {
			await interaction.reply(`You are currently solving ${curr_prob}. Either finish it (\`/gotgud\`) or use \`/nogud\` to skip it.`, { ephemeral: true });
			return;
		}
		const rating = users[uid].rating;
		const pt_rng = point_ranges(users[uid].rating_deviation);
		let response = await axios.get(`https://dmoj.ca/api/v2/problems?page=${Math.floor(Math.random() * 5) + 1}`);
		let usersolved = (await axios.get(`https://dmoj.ca/api/v2/user/${users[uid].username}`)).data.data.object.solved_problems;
		let problems = response.data.data.objects;
		problems.sort(() => 0.5 - Math.random());
		for (let i = 0; i < problems.length; i++) {
			if (problems[i].is_public == false) continue;
			if (usersolved.includes(problems[i].code)) continue;
			let tmp = problems[i].points - rating_to_points(rating);
			if (-pt_rng <= tmp && tmp <= pt_rng) {
				users[uid].current_problem = problems[i].code;
				fs.writeFile('users.json', JSON.stringify(users), (err) => {
					if (err) {
						console.error(err);
					}
				});
				const embed = new EmbedBuilder()
					.setTitle('gitgud')
					.setColor(0x00AE86)
					.setDescription(`Go do [${problems[i].code}](https://dmoj.ca/problem/${problems[i].code}). When you're done, use \`/gotgud\`. If you don't want to do this problem, use \`/nogud\`.`)
					.addFields(
						{ name: 'Problem Name', value: problems[i].name, inline: true },
						{ name: 'Problem Points', value: problems[i].points.toString(), inline: true },
					)
					.setTimestamp();
				await interaction.reply({ embeds: [embed] });
				return;
			}
		}
		await interaction.reply('Either you got extremely unlucky (just run the command again) or you are too good for this bot (GGEZ).');
		return;
	},
};
