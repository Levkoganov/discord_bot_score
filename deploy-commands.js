const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const deployCommands = (guildID) => {

	const commands = [] // Array for command
	// Check all files in command folder
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	
	// Loop through commands files
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}

	// Discord bot token
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

	// Invoke appliction guild command
	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');
			await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          guildID === undefined ? process.env.DISCORD_GUILD_ID : guildID
        ),
        { body: commands }
      );	
		} catch (error) {
			console.error(error);
		}
	})();
}

module.exports = {
	deployCommands
}