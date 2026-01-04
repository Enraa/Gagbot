const discord = require('discord.js')
const fs = require('fs')
const path = require('path');
const admZip = require('adm-zip');
const { getTimestringForZip } = require("./functions/timefunctions");
const env = require('dotenv')

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
    let allcommands = await client.application.commands.fetch()
    for (const guild of allguilds) {
        let guildfetched = await client.guilds.fetch(guild[0])
        let guildapps = await guildfetched.commands.fetch()
        guildapps = guildapps.map((m) => { return { name: m.name, desc: m.description, guildId: m.guildId, id: m.id }})
        console.log(guild[1].name)
        console.log(guildapps)
    }
})

client.login(process.env.DISCORDBOTTOKEN)

console.log(JSON.stringify(['1443329378560901303']))