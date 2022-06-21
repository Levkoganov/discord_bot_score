const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require("discord.js");
const scoreEmbed = require("../functions/scoreEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("start a game!")

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
      // Local images
      const authorImg = new MessageAttachment("./public/img/julian_author.png");
      const iconImg = new MessageAttachment("./public/img/bandit_icon.png");

      // Empty space variable
      const emptySpace = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B";

      // All players
      const p1 = interaction.options.getUser("player1");
      const p2 = interaction.options.getUser("player2");

      // Player avatars
      const p1_avatar = p1.displayAvatarURL({ dynamic: true });
      const p2_avatar = p2.displayAvatarURL({ dynamic: true });

      // Player score
      let p1_score = 0;
      let p2_score = 0;

      // Creating new card Embed
      const cardEmbed = scoreEmbed(p1, p2, p1_score, p2_score); // Embed card
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
        if (i.user.id === p1.id || i.user.id === p2.id) // Check users ID
          if (i.customId === i.user.username)// Limit by username
            return true;

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
        max: 19,
      });

      // Listen on success
      collector.on("collect", async (i) => {
        // Player1 btn
        if (i.customId === p1.username) {
          p1_score++; // Increment counter when btn clicked
          let btn1_player1Update = `**__PLAYER1__ (${p1_score})${emptySpace} \n` + "`1`" + `${p1}**`;
          let btn1_player2Update = `*~~__PLAYER2__ (${p2_score})\n` + "`2`" + `${p2}~~*`;

          // Player1 win
          if (p1_score === 10) {
            cardEmbed.fields[0].value = btn1_player1Update; // Winner field
            cardEmbed.fields[2].value = btn1_player2Update; // Loser field
            cardEmbed.setTitle(`${Winneremoji}*${p1.username}*`);
            cardEmbed.setThumbnail(p1_avatar);

            return await i.update({
              embeds: [cardEmbed],
              files: [authorImg],
              components: [],
            });
          }

          // Update player1 embed
          cardEmbed.fields[0].value = btn1_player1Update; // Edit embed field
          await i.update({ embeds: [cardEmbed] });
        }

        // Player2 btn
        if (i.customId === p2.username) {
          
          p2_score++; // Increment counter when btn clicked
          let btn2_player1Update = `*~~__PLAYER1__ (${p1_score})~~${emptySpace} \n` + "~~`1`" + `${p1}~~*`
          let btn2_player2Update = `**__PLAYER2__ (${p2_score})\n` + "`2`" + `${p2}**`;

          // Player2 win
          if (p2_score === 10) {
            cardEmbed.fields[2].value = btn2_player2Update; // Winner field
            cardEmbed.fields[0].value = btn2_player1Update; // Loser field
            cardEmbed.setTitle(`${Winneremoji}*${p2.username}*`);
            cardEmbed.setThumbnail(p2_avatar);
            
            return await i.update({
              embeds: [cardEmbed],
              files: [authorImg],
              components: [],
            });
          }

          // Update player1 embed
          cardEmbed.fields[2].value = btn2_player2Update; // Edit embed field
          await i.update({ embeds: [cardEmbed] });
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
