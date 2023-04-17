const { SlashCommandBuilder } = require('discord.js');
const { update_rating, rating_to_title, titles } = require('../rating_helper.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nogud')
		.setDescription('Skips your current problem'),
	async execute(interaction) {
		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		const uid = interaction.user.id;
		if (!users[uid]) {
			await interaction.reply('You are not linked to any DMOJ account');
			return;
		}
		const curr_prob = users[uid].current_problem;
		if (!curr_prob) {
			await interaction.reply('You are not currently solving a problem. Use `/gitgud` to get a new problem.');
			return;
		}
		const username = users[uid].username;
		const rating = users[uid].rating;
		const rating_deviation = users[uid].rating_deviation;
		const points = (await axios.get(`https://dmoj.ca/api/v2/problem/${curr_prob}`)).data.data.object.points;
		let response = await axios.get(`https://dmoj.ca/api/v2/user/${username}`);
		let solved = response.data.data.object.solved_problems;
		if (!solved.includes(curr_prob)) {
			let new_rating = update_rating(rating, rating_deviation, -points);
			users[uid].rating = new_rating[0];
			users[uid].rating_deviation = new_rating[1];
			users[uid].current_problem = null;
			await interaction.reply(`You could not solve ${curr_prob}. Your new rating is ${new_rating[0]}.`);
			fs.writeFile('users.json', JSON.stringify(users), (err) => {
				if (err)
					console.error(err);
			});
			if (rating_to_title(new_rating[0]) == rating_to_title(rating)) 
				return;
			// remove old role
			const guild = interaction.guild;
			const member = guild.members.cache.get(uid);
			const old_role = member.roles.cache.find(role => titles.includes(role.name));
			if (old_role)
				member.roles.remove(old_role);
			// update role
			const role = guild.roles.cache.find(role => role.name === rating_to_title(new_rating[0]));
			member.roles.add(role);
			return;
		}
		await interaction.reply(`You have solved ${curr_prob} already. Use \`/gotgud\` to mark it as solved.`);
		return;
	},
};
