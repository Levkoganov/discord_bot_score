const setGuildChannel = require("../models/setGuildChannel-schema");

// Get selected channel
async function getChannelData(guildId, interaction) {
  try {
    // Check if channel exist in server
    const result = await setGuildChannel.findById(guildId);
    if(!result) return;
    const { channelId } = result;

    // Return channel information
    return interaction.guild.channels.cache.get(channelId);

  } catch (error) {
    console.log(error);
  }
}

module.exports = getChannelData;
