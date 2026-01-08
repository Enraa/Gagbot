const discord = require('discord.js')
const fs = require('fs')
const path = require('path');
const admZip = require('adm-zip');
const { getTimestringForZip } = require("./functions/timefunctions");
const env = require('dotenv')
const nlp = require('compromise');
const nlpSpeech = require('compromise-speech');
nlp.extend(nlpSpeech);

env.config();

let textinputs = [`compromise`, `Enraa`, `super`, `XD`, `lol`, `mostly`, `indication`]
textinputs.forEach((t) => {
    let tmodified = nlp(t)
    tmodified.compute('syllables')
    tmodified.terms().json().forEach((termdata) => {
        console.log(`Syllables output for ${termdata.text}:`)
        console.log(termdata.terms[0].syllables)
    })
})



/*
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
        console.log(guildapps.length)
        guildapps = guildapps.map((m) => { return { name: m.name, desc: m.description, guildId: m.guildId, id: m.id }})
        console.log(guild[1].name)
        console.log(guildapps.length)
    }
})

client.login(process.env.DISCORDBOTTOKEN)

console.log(JSON.stringify(['1443329378560901303']))*/