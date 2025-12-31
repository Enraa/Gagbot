const { getText } = require("./functions/textfunctions.js");
const { processHeadwearEmoji } = require("./functions/headwearfunctions.js");

let regex = /<a?:.+:[0-9]*>|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g

let texttotry = `This is a text with some emoji 👎️ ✊ 👊 🤛 🤜 and a Discord emoji <:Gag:1073495437635506216>.`
console.log(texttotry)
console.log(texttotry.replaceAll(regex, "😗"))