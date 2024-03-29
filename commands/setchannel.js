const { SlashCommandBuilder } = require("@discordjs/builders");
const setGuildChannel = require("../models/setGuildChannel-schema");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("set a ranked channel channel")

    // Channel name
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("pick your channel name")
        .setRequired(true)
    ),

  async execute(interaction) {
    // If user is not admin
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply({
        content: "You dont have permission for this command...",
        ephemeral: true,
      });
    }

    const channel = interaction.options.getChannel("channel"); // Channel info

    // Check for text channel
    if (!channel || channel.type !== "GUILD_TEXT") {
      return interaction.reply({
        content: "Please tag a text channel.",
        ephemeral: true,
      });
    }

    // Add channel to DB
    const setChannel = await setGuildChannel.findOneAndUpdate(
      { _id: interaction.guild.id },
      {
        _id: interaction.guild.id,
        channelId: channel.id,
        channelName: channel.name,
      },
      { upsert: true }
    );

    // Reply if channel is set
    if (setChannel) {
      return interaction.reply({
        content: "Rank channel is set.",
        ephemeral: true,
      });
    }
  },
};
