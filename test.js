const { getText } = require("./functions/textfunctions.js");
const { processHeadwearEmoji } = require("./functions/headwearfunctions.js");
const { getHeadwear, getHeadwearName, getLockedHeadgear, addLockedHeadgear, removeLockedHeadgear } = require('./functions/headwearfunctions.js');

let itemsworn = getHeadwear("125093095405518850")
let itemslocked = getLockedHeadgear("125093095405518850")

console.log(itemsworn)
console.log(itemslocked)