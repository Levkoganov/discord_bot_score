const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

// Functions
const getUserRank = require("../functions/getUserRank");
const playerRankEmbed = require("../functions/embeds/playerRankEmbed")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("get player rank")

    .addUserOption((option) =>
      option.setName("player").setDescription("select player").setRequired(true)
    ),

  async execute(interaction) {
    try {
      const username = interaction.options.getUser("player"); // User information
      const userInfo = await getUserRank(username);
      
      if (userInfo.length === 0) {
        return await interaction.reply({ content: "This user is not ranked!", ephemeral: true });
        
      } else if (userInfo.length > 0) {
        const iconImg = new MessageAttachment("./public/img/julian_author.png"); // Images
        const embedData = playerRankEmbed(userInfo, true); // Create rank embed
        
        return await interaction.reply({
          embeds: [embedData],
          files: [iconImg],
          ephemeral: true,
        });
 
      } else {
        return await interaction.reply({ content: "Someting went wrong...", ephemeral: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
