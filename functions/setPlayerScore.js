const setPlayerScoreSchema = require("../models/setPlayerScore-schema");
const { pointSystem } = require("./pointSystem");

async function setPlayerScore(winnerInfo, loserInfo, serverName) {
  try {
    const winnerData = await setPlayerScoreSchema.findById(winnerInfo.id);
    const loserData = await setPlayerScoreSchema.findById(loserInfo.id);
    const winnerPoints = await pointSystem(winnerInfo, loserInfo);
    const loserPoints = await pointSystem(winnerInfo, loserInfo, true);

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

    if (!loserData) {
      await setPlayerScoreSchema({
        _id: loserInfo.id,
        servername: serverName,
        name: loserInfo.username,
        lose: 1,
      }).save();
    }

    if (winnerData) {
      await setPlayerScoreSchema.findOneAndUpdate(
        { _id: winnerData._id },
        { $inc: { score: winnerPoints, win: 1 } },
        { new: true, upsert: true, useFindAndModify: false }
      );
    }

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

module.exports = setPlayerScore;