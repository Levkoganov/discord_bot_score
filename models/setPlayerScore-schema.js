const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  require:true,
}

const defaultNumber = {
  type: Number,
  default: 0
}

const defaultScore = {
  type: Number,
  default: 100
}

// playerScore schema
const setPlayerScore = new Schema({
  _id: reqString,
  servername: reqString,
  name: reqString,
  win: defaultNumber,
  lose: defaultNumber,
  score: defaultScore
},
{ timestamps: true }
);

module.exports = mongoose.model('Player-score', setPlayerScore);