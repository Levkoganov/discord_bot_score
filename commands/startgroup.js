const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageButton,
  MessageAttachment,
  Permissions
} = require("discord.js");
const getChannelData = require("../functions/getChannelData");
const teamScoreEmbed = require("../functions/teamScoreEmbed");
const randomPicture = require("../functions/randomPicture");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("startgroup")
    .setDescription("Start a group game(4)")

    .addNumberOption((option) =>
      option
        .setName("rounds")
        .setDescription("select number of rounds")
        .setRequired(true)
        .addChoices({
          name: "First to 3",
          value: 3,
        })
        .addChoices({
          name: "First to 5",
          value: 5,
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
        .setDescription("select player 2")
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName("player2")
        .setDescription("select player 2")
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName("player3")
        .setDescription("select player 3")
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName("player4")
        .setDescription("select player 4")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Server and Channel info
      const guildId = interaction.guild.id;
      const channelInfo = {};
      let channelData = channelInfo[guildId];

      // Local images
      const imgResult = randomPicture(); // Generate random img
      const authorImg = new MessageAttachment("./public/img/julian_author.png");
      const iconImg = new MessageAttachment(`./public/img/${imgResult}`);

      // Empty space variable
      const emptySpace = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";

      // All players
      const p1 = interaction.options.getUser("player1");
      const p2 = interaction.options.getUser("player2");
      const p3 = interaction.options.getUser("player3");
      const p4 = interaction.options.getUser("player4");
      const rounds = interaction.options.getNumber("rounds"); // Number of rounds

      // Team score
      let t1_score = 0;
      let t2_score = 0;

      const players = [p1.username, p2.username, p3.username, p4.username]; // Player name arrays
      const cardEmbed = teamScoreEmbed(
        p1,
        p2,
        p3,
        p4,
        t1_score,
        t2_score,
        rounds,
        imgResult
      ); // Embed card
      const Winneremoji = "<:trophy:988122907815325758>"; // Winner emoji

      const row = new MessageActionRow()
        // Btn(1)
        .addComponents(
          new MessageButton()
            .setCustomId(`${p1.username} ${p2.username}`)
            .setLabel("Team1")
            .setStyle("PRIMARY")
        )
        // Btn(2)
        .addComponents(
          new MessageButton()
            .setCustomId(`${p3.username} ${p4.username}`)
            .setLabel("Team2")
            .setStyle("SUCCESS")
        );

      // Checking for unique names
      const uniquePlayers = players.filter((v, i, a) => a.indexOf(v) === i);

      // Check if all player are unique
      if (uniquePlayers.length < 4) {
        return await interaction.reply({
          content: `Please make ur choosing different players`,
          ephemeral: true,
        });
      }

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
        if (
          i.user.id === p1.id ||
          i.user.id === p2.id ||
          i.user.id === p3.id ||
          i.user.id === p4.id
        )
          // Limit by team name;
          if (i.customId.includes(i.user.username)) return true;

        // Check for specific name
        if (i.user.username === "Kurama")
          return await i.reply({ content: `קורמה משתולל 👀`, ephemeral: true });

        // Username ID dont match
        return await i.reply({
          content: `These buttons aren't for you...`,
          ephemeral: true,
        });
      };

      const collector = rep.createMessageComponentCollector({
        filter,
        max: 19,
      });

      // Listen on success
      collector.on("collect", async (i) => {
        // Team1 btn
        if (i.customId.includes(p1.username) && i.customId.includes(p2.username)) {
          t1_score++; // Increment counter when btn clicked
          let btn1_team1Update = `**__TEAM1__ (${t1_score})**${emptySpace} \n` + "`1`" + `${p1}\n` + "`2`" + `${p2}`;
          let btn1_team2Update = `*~~__TEAM2__ (${t2_score})~~*\n` + "~~`3`" + `${p3}~~\n` + "~~`4`" + `${p4}~~`;

          // Team1 win
          if (t1_score === rounds) {
            cardEmbed.fields[0].value = btn1_team1Update; // Winner field
            cardEmbed.fields[2].value = btn1_team2Update; // Loser field
            cardEmbed.setTitle(`${Winneremoji}*${p1.username}*\n${Winneremoji}*${p2.username}*`);
            await i.update({ embeds: [cardEmbed], components: [] });

            // check and set if channel exist
            const channelId = await getChannelData(guildId, interaction);

            // Check if channel set.
            if (!channelId) 
              // Channel is not set reply.
              return await i.editReply({content: "please set a channel with '/setchannel'."});
            

            // set data for channel
            channelData = channelInfo[guildId] = channelId;

            // Check if bot have permissions
            if (i.guild.me.permissionsIn(channelId).has(Permissions.FLAGS.VIEW_CHANNEL && Permissions.FLAGS.SEND_MESSAGES)) {
              // Send card info to channel.
              return channelData.send({
                embeds: [cardEmbed],
                files: [authorImg, iconImg],
                components: [],
              });
            } else {
              // channelId.permissionOverwrites.edit(i.guild.me.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true});
              return await i.editReply({
                content: `bot doesn't have a permission for "${channelId.name}" channel`,
              });
            }
          }

          // Update team1 embed
          cardEmbed.fields[0].value = btn1_team1Update; // Edit embed field
          await i.update({ embeds: [cardEmbed] });
        }

        // Team2 btn
        if (i.customId.includes(p3.username) &&i.customId.includes(p4.username)) {
          t2_score++; // Increment counter when btn clicked
          let btn2_team1Update = `*~~__TEAM1__ (${t1_score})~~* ${emptySpace}\n ` + "~~`1`" + `${p1}~~\n` + "~~`2`" + `${p2}~~`;
          let btn2_team2Update = `**__TEAM2__ (${t2_score})**\n` + "`3`" + `${p3}\n` + "`4`" + `${p4}`;

          // Team2 win
          if (t2_score === rounds) {
            cardEmbed.fields[2].value = btn2_team2Update; // Winner field
            cardEmbed.fields[0].value = btn2_team1Update; // Loser field
            cardEmbed.setTitle(`${Winneremoji}*${p3.username}*\n${Winneremoji}*${p4.username}*`);
            await i.update({ embeds: [cardEmbed], components: [] });

            // check and set if channel exist
            const channelId = await getChannelData(guildId, interaction);

            // Check if channel set.
            if (!channelId)
              // Channel is not set reply.
              return await i.editReply({content: "please set a channel with '/setchannel'."});

            // set data for channel
            channelData = channelInfo[guildId] = channelId;

            // Check if bot have permissions
            if (i.guild.me.permissionsIn(channelId).has(Permissions.FLAGS.VIEW_CHANNEL && Permissions.FLAGS.SEND_MESSAGES)) {
              // Send card info to channel.
              return channelData.send({
                embeds: [cardEmbed],
                files: [authorImg, iconImg],
                components: [],
              });
            } else {
              // channelId.permissionOverwrites.edit(i.guild.me.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true});
              return await i.editReply({
                content: `bot doesn't have a permission for "${channelId.name}" channel`,
              });
            }
          }

          // Update team2 embed
          cardEmbed.fields[2].value = btn2_team2Update; // Edit embed field
          await i.update({ embeds: [cardEmbed] });
        }
      });

      // Listen on end
      collector.on("end", (collected) =>
        console.log(`Collected ${collected.size} items`)
      );
    } catch (err) {
      console.log(err);
    }
  },
};
