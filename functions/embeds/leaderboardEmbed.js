const { MessageEmbed } = require("discord.js");

function leaderboardEmbed(rankedPlayersData) {
  // inside a command, event listener, etc.
  const firstPlace = "<:first_place:1001936928133873745>"; // Winner emoji
  const secondPlace = "<:second_place:1001936945208889465>"; // Winner emoji
  const thirdPlace = "<:third_place:1001936962862719026>"; // Winner emoji

  const rankedEmbedData = new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle("\u200B")
    .setAuthor({
      name: "TOP 10 PLAYERS",
      iconURL: "attachment://julian_author.png",
    })

    .setImage("attachment://lf2_title_icon.png")
    .setFooter({ text: 'leaderboards last update', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
    .setTimestamp();

  rankedPlayersData.forEach((data) => {
    rankedEmbedData.addFields({
      name: `${data.rank === 1 ? firstPlace : data.rank === 2 ? secondPlace : data.rank === 3 ? thirdPlace : 'Rank'.concat('`', data.rank, '`: ')} ${''.concat('__',data.name,'__')}`,
      value: `Points:${data.score} | Win:${data.win} | Lose:${data.lose}`,
    });
  });

  return rankedEmbedData;
}

module.exports = leaderboardEmbed;