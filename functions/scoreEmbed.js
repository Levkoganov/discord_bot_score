const { MessageEmbed } = require("discord.js");

function scoreEmbed(player1, player2, score1, score2, rounds, thumbnailImg) {
  const emptySpace = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B" // Empty space
  const player1Info = `**__PLAYER1__ (${score1})${emptySpace} \n` +  "`1`" +`${player1}**`; // Player 1 string info
  const player2Info = `**__PLAYER2__ (${score2})\n` + "`2`" + `${player2}**`; // Player 2 string info

  return new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle(`*Match (first to ${rounds})*`)
    .setAuthor({
      name: "lf2.co.il",
      iconURL: "attachment://julian_author.png",
      url: "https://lf2.co.il/",
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
        value: `***--VS--***${emptySpace}`,
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
