const fs = require("node:fs");
// Get all images from public/img folder that end with .png
const commandFiles = fs.readdirSync("./public/img").filter((file) => file.endsWith(".png"));

// Generate random img
function getRndImgStringArray() {
  return commandFiles[Math.floor(Math.random() * commandFiles.length)];
}

module.exports = getRndImgStringArray;
