const { MessageEmbed } = require("discord.js");

function scoreEmbed(player1, player2, player3, player4, t1_score, t2_score, rounds, imgResult) {
  const team1Info = `**__TEAM1__ (${t1_score})**\n` + "`1`" + `${player1}\n` + "`2`" + `${player2}` // Player 1 string info
  const team2Info = `**__TEAM2__ (${t2_score})**\n` + "`3`" + `${player3}\n` + "`4`" + `${player4}` // Player 2 string info

  return new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle(`*Group match (first to ${rounds})*`)
    .setAuthor({
      name: "lf2.co.il",
      iconURL: "attachment://julian_author.png",
      url: "https://lf2.co.il/",
    })
    
    .setThumbnail(`attachment://${imgResult}`)
    .addFields(
      {
        name: "\u200B",
        value: team1Info,
        inline: true,        
      },

      {
        name: "\u200B",
        value: `***--VS--***`,
        inline: true,
      },
      {
        name: "\u200B",
        value: team2Info,
        inline: true,
      }
    )
    .setTimestamp();
}

module.exports = scoreEmbed;
