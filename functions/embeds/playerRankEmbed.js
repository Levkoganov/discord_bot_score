const { MessageEmbed } = require("discord.js");

function playerRankEmbed(rankedPlayersData) {
  // inside a command, event listener, etc.
  const firstPlace = "<:first_place:1001936928133873745>"; // Winner emoji
  const secondPlace = "<:second_place:1001936945208889465>"; // Winner emoji
  const thirdPlace = "<:third_place:1001936962862719026>"; // Winner emoji

  // Embed messagge
  const rankedEmbedData = new MessageEmbed()
    .setColor("BLURPLE")
    .setTitle("\u200B")
    .setAuthor({
      name: "Player information",
      iconURL: "attachment://julian_author.png",
    })

    .setFooter({ text: 'based on leaderboard.' })

  // Loop through all ranked players
  rankedPlayersData.forEach((data) => {
    rankedEmbedData.addFields({
      // Append emote to top 3 players else append number
      name: `${data.rank === 1 ? firstPlace : data.rank === 2 ? secondPlace : data.rank === 3 ? thirdPlace : 'Rank'.concat('`', data.rank, '`: ')} ${''.concat('__',data.name,'__')}`,
      value: `Points:${data.score} | Win:${data.win} | Lose:${data.lose}`,
    });
  });

  return rankedEmbedData;
}

module.exports = playerRankEmbed;