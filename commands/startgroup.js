const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require("discord.js");
const teamScoreEmbed = require("../functions/teamScoreEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("startgroup")
    .setDescription("Start a group game(4)")

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
      // Local images
      const authorImg = new MessageAttachment("./public/img/julian_author.png");
      const iconImg = new MessageAttachment("./public/img/bandit_icon.png");

      // Empty space variable
      const emptySpace = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";

      // All players
      const p1 = interaction.options.getUser("player1");
      const p2 = interaction.options.getUser("player2");
      const p3 = interaction.options.getUser("player3");
      const p4 = interaction.options.getUser("player4");

      // Team score
      let t1_score = 0;
      let t2_score = 0;

      const players = [p1.username, p2.username, p3.username, p4.username]; // Player name arrays
      const cardEmbed = teamScoreEmbed(p1, p2, p3, p4, t1_score, t2_score); // Embed card
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
        const result = i.customId.trim().split(/\s+/);

        // Check users ID
        if (
          i.user.id === p1.id ||
          i.user.id === p2.id ||
          i.user.id === p3.id ||
          i.user.id === p4.id
        )
          // Limit by team name
          for (const team_username of result) {
            if (team_username === i.user.username) return true;
          }

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
        const result = i.customId.trim().split(/\s+/);

        // Team1 btn
        if (result[0] === p1.username || result[1] === p2.username) {
          t1_score++; // Increment counter when btn clicked

          // Team1 win
          if (t1_score === 10) {
            cardEmbed.fields[0].value = `__TEAM1(***${t1_score}***)__${emptySpace} \n${p1}\n${p2}`;
            cardEmbed.fields[2].value = `~~__TEAM2(***${t2_score}***)__\n${p3}\n${p4}~~`;
            cardEmbed.setTitle(`*${Winneremoji}${p1.username}\n${Winneremoji}${p2.username}*`);
            return await i.update({ embeds: [cardEmbed], components: [] });
          }

          // Update team1 embed
          cardEmbed.fields[0].value = `__TEAM1(***${t1_score}***)__ ${emptySpace} \n${p1}\n${p2}`;
          await i.update({ embeds: [cardEmbed] });
        }

        // Team2 btn
        if (result[0] === p3.username || result[1] === p4.username) {
          t2_score++; // Increment counter when btn clicked

          // Team2 win
          if (t2_score === 10) {
            cardEmbed.fields[2].value = `__TEAM2(***${t2_score}***)__\n${p3}\n${p4}`;
            cardEmbed.fields[0].value = `~~__TEAM1(***${t1_score}***)__~~${emptySpace} ~~\n${p1}\n${p2}~~`;
            cardEmbed.setTitle(`*${Winneremoji}${p3.username}\n${Winneremoji}${p4.username}`);
            return await i.update({ embeds: [cardEmbed], components: [] });
          }

          // Update team2 embed
          cardEmbed.fields[2].value = `__TEAM2(***${t2_score}***)__ ${emptySpace} \n${p3}\n${p4}`;
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
