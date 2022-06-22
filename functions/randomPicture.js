const fs = require("node:fs");
const commandFiles = fs.readdirSync("./public/img").filter((file) => file.endsWith(".png"));

function getRndImgStringArray() {
  return commandFiles[Math.floor(Math.random() * commandFiles.length)];
}

module.exports = getRndImgStringArray;
