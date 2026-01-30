const discord = require('discord.js')
const fs = require('fs')
const path = require('path');
const admZip = require('adm-zip');
const { getTimestringForZip } = require("./functions/timefunctions");
const env = require('dotenv')
const nlp = require('compromise');
const nlpSpeech = require('compromise-speech');
const { getChastity } = require('./functions/vibefunctions.js');
const { setUpToys } = require('./functions/toyfunctions.js');
nlp.extend(nlpSpeech);

env.config();

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.MessageContent,
        discord.GatewayIntentBits.GuildMembers
    ]
})

client.on("clientReady", async () => {
    // This is run once we’re logged in!
    console.log(`Logged in as ${client.user.tag}!`)
    try {
        await client.application.fetch();
        console.log(`Bot is owned by user ID ${client?.application?.owner.id}`)
    }
    catch (err) {
        console.log(err)
    }

    // List all guilds the server is in.
    let allguilds = await client.guilds.fetch();
    let guilds = [];
    for (const guild of allguilds) {
        let guildfetched = await client.guilds.fetch(guild[0])
        let guildmembers = await guildfetched.members.fetch()
        console.log(guildmembers.get("125093095405518850"))
    }
    console.log(guilds)
})

client.login(process.env.DISCORDBOTTOKEN)