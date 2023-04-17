const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Links your Discord account to your DMOJ account')
		.addStringOption(option => option.setName('username').setDescription('Your DMOJ username').setRequired(true)),
	async execute(interaction) {
		const username = interaction.options.getString('username');
		const uid = interaction.user.id;

		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		if (users[uid]) {
			await interaction.reply(`You are already linked to ${users[uid]['username']}`);
			return;
		}

		users[uid] = {
			"username": username,
			"rating": 1200,
			"rating_deviation": 350, // (not) glicko2
			"current_problem": null,
			"problem_cnt": 0,
		};
		fs.writeFile('users.json', JSON.stringify(users), (err) => {
			if (err)
				console.error(err);
		});
		const member = interaction.guild.members.cache.get(uid);
		const role = interaction.guild.roles.cache.find(role => role.name === 'Silver');
		member.roles.add(role);
		await interaction.reply(`You are now linked to ${username}`);
	},
};
