const { MessageAttachment } = require("discord.js");

const setPlayerScoreSchema = require("../models/setPlayerScore-schema");
const leaderboardEmbed = require("./embeds/leaderboardEmbed");

// Update rank leaderboard
async function updateRankChannel(channel) {
  try {
    const channelData = await channel.messages.fetch(); // Get channel info
    const rankPlayerData = await getAllPlayersRanks(); // Get ranked players
    const embedData = leaderboardEmbed(rankPlayerData); // Create rank embed

    // Images
    const iconImg = new MessageAttachment("./public/img/julian_author.png");
    const authorImg = new MessageAttachment("./public/img/lf2_title_icon.png");

    // Check number of message in channel
    if (channelData.size === 0) {
      return channel.send({ embeds: [embedData], files: [iconImg, authorImg] });
    } else {
      let counter = 0; // Counter for loop iteration
      for (const message of channelData) {
        counter++; // Increment number every iteration

        // Check and for bot message
        if (message[1].author.bot) {
          // Edit bot message
          return message[1].edit({
            embeds: [embedData],
            files: [iconImg, authorImg],
          });

          // If no bot message
        } else if (!message[1].author.bot && channelData.size === counter) {
          // Send new message
          return channel.send({
            embeds: [embedData],
            files: [iconImg, authorImg],
          });

          // Unexpected error
        } else {
          console.log("sometingh went wrong (updateRankChannel)");
          return;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

// Query for top 10 players
async function getAllPlayersRanks() {
  try {
    return await setPlayerScoreSchema.aggregate([
      {
        $sort: { score: -1, win: -1, lose: 1 },
      },
      {
        $group: { _id: "", items: { $push: "$$ROOT" } },
      },
      {
        $unwind: { path: "$items", includeArrayIndex: "items.rank" },
      },
      { $replaceRoot: { newRoot: "$items" } },
      {
        $addFields: { rank: { $add: ["$rank", 1] } },
      },
      {
        $sort: { score: -1, win: -1, lose: 1 },
      },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          score: "$score",
          rank: "$rank",
          win: "$win",
          lose: "$lose",
        },
      },
      { $limit: 10 },
    ]);
  } catch (error) {
    console.log(error);
  }
}

module.exports = updateRankChannel;
