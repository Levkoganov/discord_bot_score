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

// playerScore schema
const setPlayerScore = new Schema({
  _id: reqString,
  servername: reqString,
  name: reqString,
  win: defaultNumber,
  lose: defaultNumber,
  score: defaultNumber
},
{ timestamps: true }
);

module.exports = mongoose.model('Player-score', setPlayerScore);