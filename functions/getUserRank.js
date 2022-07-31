const setPlayerScoreSchema = require("../models/setPlayerScore-schema");

// Update rank leaderboard
async function getUserRank(user) {
  try {
    // Images
    const userInfo = await getUserInfo(user.id); // Get ranked players
    return userInfo
    
  } catch (err) {
    console.log(err);
  }
}

// Query for top 10 players
async function getUserInfo(userId) {
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
      {
        $match: { _id: userId }
      },
    ]);
  } catch (error) {
    console.log(error);
  }
}

module.exports = getUserRank;
