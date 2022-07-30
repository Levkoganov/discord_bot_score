const setPlayerScoreSchema = require("../models/setPlayerScore-schema");
const { pointSystem } = require("./pointSystem");

async function updatePlayerScore(winnerInfo, loserInfo, serverName) {
  try {
    //Find player data by id
    const winnerData = await setPlayerScoreSchema.findById(winnerInfo.id);
    const loserData = await setPlayerScoreSchema.findById(loserInfo.id);

    // Player points
    const winnerPoints = await pointSystem(winnerInfo, loserInfo);
    const loserPoints = await pointSystem(winnerInfo, loserInfo, true);
    
    // Save winner info 
    if (!winnerData) {
      await setPlayerScoreSchema({
        _id: winnerInfo.id,
        servername: serverName,
        name: winnerInfo.username,
        win: 1,
        name: winnerInfo.username,
        score: winnerPoints,
      }).save();
    }

    // Save loser info
    if (!loserData) {
      await setPlayerScoreSchema({
        _id: loserInfo.id,
        servername: serverName,
        name: loserInfo.username,
        lose: 1,
        score: loserPoints,
      }).save();
    }

    // Update winner score
    if (winnerData) {
      await setPlayerScoreSchema.findOneAndUpdate(
        { _id: winnerData._id },
        { $inc: { score: winnerPoints, win: 1 } },
        { new: true, upsert: true, useFindAndModify: false }
      );
    }

    // Update loser score
    if (loserData) {
      await setPlayerScoreSchema.findOneAndUpdate(
        { _id: loserData._id },
        { $inc: { score: loserPoints, lose: 1 } },
        { new: true, upsert: true, useFindAndModify: false }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = updatePlayerScore;