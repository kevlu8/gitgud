const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { titles } = require('../rating_helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlink')
		.setDescription('Unlinks your Discord account from your DMOJ account'),
	async execute(interaction) {
		const uid = interaction.user.id;

		let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
		if (!users[uid]) {
			await interaction.reply(`You are not linked to any DMOJ account`);
			return;
		}

		delete users[uid];
		fs.writeFile('users.json', JSON.stringify(users), (err) => {
			if (err) {
				console.error(err);
			}
		});
		const member = interaction.guild.members.cache.get(uid);
		const rating_roles = interaction.guild.roles.cache.filter(role => titles.includes(role.name));
		member.roles.remove(rating_roles);
		await interaction.reply(`You are no longer linked.`);
	},
};
