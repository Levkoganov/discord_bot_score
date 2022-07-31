const { MessageEmbed } = require("discord.js");

function scoreEmbed(player1, player2, score1, score2, rounds, thumbnailImg) {
  const player1Info = `**__PLAYER1__ (${score1}) \n` +  "`1`" +`${player1}**`; // Player 1 string info
  const player2Info = `**__PLAYER2__ (${score2})\n` + "`2`" + `${player2}**`; // Player 2 string info

  // Embed messagge
  return new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle(`*Match (first to ${rounds})*`)
    .setAuthor({
      name: "little fighter",
      iconURL: "attachment://julian_author.png",
    })
    .setThumbnail(`attachment://${thumbnailImg}`)
    .addFields(
      {
        name: "\u200B",
        value: player1Info,
        inline: true,
      },

      {
        name: "\u200B",
        value: `***--VS--***`,
        inline: true,
      },

      {
        name: "\u200B",
        value: player2Info,
        inline: true,
      }
    )
    .setTimestamp();
}

module.exports = scoreEmbed;
