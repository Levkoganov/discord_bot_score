const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const deployCommands = (guildID) => {

	const commands = []
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

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