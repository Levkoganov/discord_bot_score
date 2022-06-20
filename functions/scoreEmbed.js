const { MessageEmbed } = require("discord.js");

function scoreEmbed (player1, player2, score1, score2) {
  return new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle(" *Match (best of 10)*")
    .setAuthor({
      name: "lf2.co.il",
      iconURL: 'attachment://julian_author.png',
      url: "https://lf2.co.il/",
    })
    .setThumbnail("attachment://bandit_icon.png")
    .addFields([
      {
        name: "\u200B",
        value: `${player1.username}(***${score1}***)`,
        inline: true,
      },

      {
        name: "\u200B",
        value: "*--VS--*",
        inline: true,
      },

      {
        name: "\u200B",
        value: `${player2.username}(***${score2}***)`,
        inline: true,
      },
    ])
    .setTimestamp();
};

module.exports = scoreEmbed
