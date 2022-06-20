const { MessageEmbed } = require("discord.js");

function scoreEmbed(player1, player2, player3, player4, t1_score, t2_score) {
  const emptySpace = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B"

  return new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle(" *Group match (best of 10)*")
    .setAuthor({
      name: "lf2.co.il",
      iconURL: "attachment://julian_author.png",
      url: "https://lf2.co.il/",
    })
    
    .setThumbnail("attachment://bandit_icon.png")
    .addFields(
      {
        name: "\u200B",
        value: `__TEAM1(***${t1_score}***)__${emptySpace} \n${player1}\n${player2}`,
        inline: true,        
      },

      {
        name: "\u200B",
        value: `*| --VS-- |*${emptySpace}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: `__TEAM2(***${t2_score}***)__\n${player3}\n${player4}`,
        inline: true,
      }
    )
    .setTimestamp();
}

module.exports = scoreEmbed;
