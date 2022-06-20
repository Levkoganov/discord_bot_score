// Imports
const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const  { deployCommands } = require('./deploy-commands')
require('dotenv').config()

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Check all commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Loop all commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	deployCommands();
	console.log('Successfully reloaded application (/) commands(READY).');

});

client.on('guildCreate', (guild) => {
	const { id } = guild;
	deployCommands(id);
	console.log('Successfully reloaded application (/) commands(guildCreate).');
});

// Interaction Listener
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  // Get interaction command name
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
    // Execure command
		await command.execute(interaction);
		
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);