const { Client, Collection, Events, GatewayIntentBits } = require('discord.js'); 
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(path.join(__dirname, 'commands', `${file}`));
	client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'wtf did you do', ephemeral: true });
	}
});

client.once(Events.ClientReady, () => {
	console.log("up");
});

client.login(process.env.TOKEN);
