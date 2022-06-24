const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  require:true,
}

// Post schema
const setGuildChannel = new Schema({
  _id: reqString, // Guild ID
  channelId: reqString
});

module.exports = mongoose.model('Guild-channel', setGuildChannel);