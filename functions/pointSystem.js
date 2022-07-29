const setPlayerScoreSchema = require("../models/setPlayerScore-schema");

async function pointSystem(winner, loser, isLoser) {
  try {
    // Users data
    const winnerData = await setPlayerScoreSchema.findById(winner.id);
    const loserData = await setPlayerScoreSchema.findById(loser.id);

    const minScore = -12; // Min Remainder Points
    const HighScore = 6; // Max Remainder Points
    const maxScore = 12; // Max Remainder Points

    // Points variables
    let finalPoints = 0;
    let smallPoints = 1;
    let regularPoints = 3;
    let bigPoints = 5;

    if (isLoser === true) {
      smallPoints = -Math.abs(smallPoints);
      regularPoints = -Math.abs(regularPoints) + 1;
      bigPoints = -Math.abs(bigPoints) + 1;
    }

    // If No winner and no loser score
    if (!winnerData && !loserData) {
      finalPoints = regularPoints;
      return finalPoints;
    }

    // If Loser doesn`t have score
    if (winnerData && !loserData) {
      switch (true) {
        // Regular Points (winner has less than 6 ponits)
        case winnerData.score <= HighScore:
          finalPoints = regularPoints;
          break;

        // Small Points (winner has 6 or more ponits)
        case winnerData.score > HighScore:
          finalPoints = smallPoints;
          break;

        default:
          finalPoints;
          console.log("something went wrong..");
          break;
      }

      return finalPoints;
    }

    // If Winner doesn`t have score
    if (!winnerData && loserData) {
      switch (true) {
        // Small Points (loser has less than 6 ponits)
        case loserData.score < HighScore:
          finalPoints = smallPoints;
          break;

        // Regular Points (loser has between 6 ~ 11 points)
        case loserData.score >= HighScore && loserData.score < maxScore:
          finalPoints = regularPoints;
          break;

        // Big Points (loser has more than 11 points)
        case loserData.score >= maxScore:
          finalPoints = regularPoints;
          break;

        default:
          finalPoints;
          console.log("loserData: something went wrong..");
          break;
      }

      if (isLoser) {
        return calLoserScore(loserData.score, finalPoints);
      }
      return finalPoints;
    }

    // If both player has score
    if (winnerData && loserData) {
      let resultRemainder = winnerData.score - loserData.score;

      switch (true) {
        // Big Points (Reminder less than or equal -12)
        case resultRemainder <= minScore:
          finalPoints = bigPoints;
          break;

        // Regular Points (Reminder is between -11 and 6)
        case resultRemainder > minScore && resultRemainder <= HighScore:
          finalPoints = regularPoints;
          break;

        // Small Points (Reminder is higher than 6)
        case resultRemainder > HighScore:
          finalPoints = smallPoints;
          break;

        default:
          finalPoints;
          console.log("winnerData && loserData: something went wrong..");
          break;
      }

      if (isLoser) {
        return calLoserScore(loserData.score, finalPoints);
      }
      return finalPoints;
    }

    return 0;
  } catch (err) {
    console.log(err);
  }
}

function calLoserScore(loserScore, finalPoints) {
  const scoreSummary = loserScore + finalPoints;
  // console.log("loserScore", loserScore);
  // console.log("finalPoints", finalPoints);
  // console.log("scoreSummary", scoreSummary);

  if (loserScore === 0) return 0;
  else if (scoreSummary === -1) return scoreSummary;
  else if (scoreSummary >= 0) return finalPoints;
  else return 0;
}

module.exports = {
  pointSystem,
};