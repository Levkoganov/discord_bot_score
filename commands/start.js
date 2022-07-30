// Dependencies imports
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageButton,
  MessageAttachment,
  Permissions,
} = require("discord.js");

// Custom functions
const getChannelData = require("../functions/getChannelData");
const updatePlayerScore = require("../functions/updatePlayerScore.js")
const updateRankChannel = require("../functions/updateRankChannel")

// Card UI
const scoreEmbed = require("../functions/embeds/scoreEmbed");
const randomPicture = require("../functions/randomPicture");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("start a game!")

    .addNumberOption((option) =>
      option
        .setName("rounds")
        .setDescription("select number of rounds")
        .setRequired(true)
        .addChoices({
          name: "First to 4",
          value: 4,
        })
        .addChoices({
          name: "First to 5",
          value: 5,
        })
        .addChoices({
          name: "First to 6",
          value: 6,
        })
        .addChoices({
          name: "First to 7",
          value: 7,
        })
        .addChoices({
          name: "First to 10",
          value: 10,
        })
    )

    .addUserOption((option) =>
      option
        .setName("player1")
        .setDescription("select player 1")
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName("player2")
        .setDescription("select player 2")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Server and Channel info
      const guiildInfo = interaction.guild;
      const channelInfo = {};
      let channelData = channelInfo[guiildInfo.id];

      const imgResult = randomPicture(); // Generate random img
      const authorImg = new MessageAttachment("./public/img/julian_author.png");
      const iconImg = new MessageAttachment(`./public/img/${imgResult}`);

      // Input information
      const p1 = interaction.options.getUser("player1"); // Player 1
      const p2 = interaction.options.getUser("player2"); // Player 2
      const rounds = interaction.options.getNumber("rounds"); // Number of rounds

      // Player avatars
      const p1_avatar = p1.displayAvatarURL({ dynamic: true });
      const p2_avatar = p2.displayAvatarURL({ dynamic: true });

      // Player score
      let p1_score = 0;
      let p2_score = 0;

      // Creating new card Embed
      const cardEmbed = scoreEmbed(
        p1,
        p2,
        p1_score,
        p2_score,
        rounds,
        imgResult
      ); // Embed card
      const Winneremoji = "<:trophy:988122907815325758>"; // Winner emoji

      const row = new MessageActionRow()
        // Btn(1)
        .addComponents(
          new MessageButton()
            .setCustomId(p1.username)
            .setLabel(p1.username)
            .setStyle("PRIMARY")
        )
        // Btn(2)
        .addComponents(
          new MessageButton()
            .setCustomId(p2.username)
            .setLabel(p2.username)
            .setStyle("SUCCESS")
        )
        // Btn(3)
        .addComponents(
          new MessageButton()
            .setCustomId("Reset")
            .setLabel("RESET 🔄")
            .setStyle("SECONDARY")
        )
        // Btn(4)
        .addComponents(
          new MessageButton()
            .setCustomId("Delete")
            .setLabel("DELETE ❌")
            .setStyle("SECONDARY")
        );

      // Reply interaction
      const rep = await interaction.reply({
        embeds: [cardEmbed],
        components: [row],
        files: [authorImg, iconImg],
        fetchReply: true,
      });

      // Filter by user click
      const filter = async (i) => {
        // Check users ID
        if (i.user.id === p1.id || i.user.id === p2.id)
          return true;
          // Limit by username
          // if (i.customId === i.user.username)
          //   return true;

        // Check for specific name
        if (i.user.username === "Kurama") {
          return await i.reply({ content: `קורמה משתולל 👀`, ephemeral: true });
        }

        // Username ID dont match
        return await i.reply({
          content: `These buttons aren't for you...`,
          ephemeral: true,
        });
      };

      const collector = rep.createMessageComponentCollector({
        filter,
        max: 99,
      });

      // Listen on success
      collector.on("collect", async (i) => {
        // Player1 btn
        if (i.customId === p1.username) {
          p1_score++; // Increment counter when btn clicked
          let btn1_player1Update = `**__PLAYER1__ (${p1_score})\n` + "`1`" + `${p1}**`;
          let btn1_player2Update = `*~~__PLAYER2__ (${p2_score})\n` + "`2`" + `${p2}~~*`;

          // Player1 win
          if (p1_score === rounds) {
            cardEmbed.fields[0].value = btn1_player1Update; // Winner field
            cardEmbed.fields[2].value = btn1_player2Update; // Loser field
            cardEmbed.setTitle(`${Winneremoji}*${p1.username} (${p1_score} - ${p2_score})*`);
            cardEmbed.setThumbnail(p1_avatar);

            // Update player score collection
            await updatePlayerScore(p1, p2, guiildInfo.name);

            // Update card
            await i.update({
              embeds: [cardEmbed],
              files: [authorImg],
              components: [],
            });

            // check and set if channel exist
            const channelId = await getChannelData(guiildInfo.id, interaction);

            // Check if channel set.
            if (!channelId) 
              // Channel is not set reply.
              return await i.editReply({content: "please set a channel with '/setchannel'."});

            // set data for channel
            channelData = channelInfo[guiildInfo.id] = channelId;

            // Check if bot have permissions
            if (i.guild.me.permissionsIn(channelId).has(Permissions.FLAGS.VIEW_CHANNEL &&Permissions.FLAGS.SEND_MESSAGES)) {
              await updateRankChannel(channelData);
              return
            } else {
              // channelId.permissionOverwrites.edit(i.guild.me.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true});
              return await i.editReply({
                content: `bot doesn't have a permission for "${channelId.name}" channel`,
              });
            }
          }

          // Update player1 embed
          cardEmbed.fields[0].value = btn1_player1Update; // Edit embed field
          await i.update({ embeds: [cardEmbed] });
        }

        // Player2 btn
        if (i.customId === p2.username) {
          p2_score++; // Increment counter when btn clicked
          let btn2_player1Update = `*~~__PLAYER1__ (${p1_score})~~\n` + "~~`1`" + `${p1}~~*`;
          let btn2_player2Update = `**__PLAYER2__ (${p2_score})\n` + "`2`" + `${p2}**`;

          // Player2 win
          if (p2_score === rounds) {
            cardEmbed.fields[2].value = btn2_player2Update; // Winner field
            cardEmbed.fields[0].value = btn2_player1Update; // Loser field
            cardEmbed.setTitle(`${Winneremoji}*${p2.username} (${p2_score} - ${p1_score})*`);
            cardEmbed.setThumbnail(p2_avatar);

            // Update player score collection
            await updatePlayerScore(p2, p1, guiildInfo.name);

            await i.update({
              embeds: [cardEmbed],
              files: [authorImg],
              components: [],
            });

            // check and set if channel exist
            const channelId = await getChannelData(guiildInfo.id, interaction);

            // Check if channel set.
            if (!channelId) 
              return await i.editReply({content: "please set a channel with '/setchannel'."});

            // set data for channel
            channelData = channelInfo[guiildInfo.id] = channelId;
            // Check if bot have permissions
            if (i.guild.me.permissionsIn(channelId).has(Permissions.FLAGS.VIEW_CHANNEL && Permissions.FLAGS.SEND_MESSAGES)) {
              // Send card info to channel.
              await updateRankChannel(channelData);
              return;

            } else {
              // channelId.permissionOverwrites.edit(i.guild.me.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true});
              return await i.editReply({
                content: `bot doesn't have a permission for "${channelId.name}" channel`,
              });
            }
          }

          // Update player1 embed
          cardEmbed.fields[2].value = btn2_player2Update; // Edit embed field
          await i.update({ embeds: [cardEmbed] });
        }

        // Reset card points
        if (i.customId === "Reset") {
          p1_score = 0; // reset p1 score
          p2_score = 0; // reset p2 score
          let resetPlayer1 = `**__PLAYER1__ (${p1_score})\n` + "`1`" + `${p1}**`;
          let resetPlayer2 = `**__PLAYER2__ (${p2_score})\n` + "`2`" + `${p2}**`;
          cardEmbed.fields[0].value = resetPlayer1 // Player1
          cardEmbed.fields[2].value = resetPlayer2; // Player2
          return await i.update({ embeds: [cardEmbed] });
        }

        // Delete bot interaction
        if (i.customId === "Delete") {
          interaction.deleteReply();
        }

      });

      // Listen when end
      collector.on("end", (collected) =>
        console.log(`Collected ${collected.size} items`)
      );
    } catch (err) {
      console.log(err);

      interaction.reply({
        content: `Something went wrong...\nPlease make ur choosing different players`,
        ephemeral: true,
      });
    }
  },
};
