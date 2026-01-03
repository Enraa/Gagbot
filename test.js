const discord = require('discord.js')
const fs = require('fs')
const path = require('path');
const admZip = require('adm-zip');
const { getTimestringForZip } = require("./functions/timefunctions");
const env = require('dotenv')
const { loadWearables } = require("./functions/wearablefunctions.js");

env.config();

loadWearables();
console.log(process.wearableslist);
console.log(`List is ${process.wearableslist.length} long.`)