const discord = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');
const https = require('https');
const { garbleMessage } = require(`./functions/gagfunctions.js`)

dotenv.config()

let GagbotSavedFileDirectory = process.env.GAGBOTFILEDIRECTORY ? process.env.GAGBOTFILEDIRECTORY : __dirname

process.GagbotSavedFileDirectory = GagbotSavedFileDirectory // Because honestly, I dont know WHY global stuff in index.js can't be accessble everywhere

console.log(fs.readdirSync(process.GagbotSavedFileDirectory))

try {
    process.gags = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/gaggedusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.mitten = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/mittenedusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.chastity = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.vibe = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.collar = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.heavy = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.pronouns = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    process.consented = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`))
}
catch (err) { 
    console.log(err);
}

// Grab all the command files from the commands directory
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

var gagged = {}

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
})

client.on("messageCreate", async (msg) => {
    // This is called when a message is received.
    try {
        console.log(msg)
        console.log(`${(msg.channel.id != process.env.CHANNELID)}`)
        console.log(`${msg.webhookId}`)
        console.log(`${msg.author.bot}`)
        console.log(`${msg.stickers?.first()}`)
        console.log(`${msg.attachments?.first()}`)
        if ((msg.channel.id != process.env.CHANNELID) || (msg.webhookId) || (msg.author.bot) || (msg.stickers?.first())) { return }
        //console.log(msg.member.displayAvatarURL())
        //console.log(msg.member.displayName)
        garbleMessage(msg);
    }
    catch (err) {
        console.log(err);
    }
})

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isModalSubmit()) {
            // We can't pass custom data through the modal except via the ID, so separate out the first part
            // as IDs will come in like collar_12451251253 - we want the collar part to query the command. 
            let interactioncommand = interaction.customId.split("_")[0]
            console.log(interactioncommand);
            if (commandFiles.includes(`${interactioncommand}.js`)) {
                const cmd = require(path.join(commandsPath, `${interactioncommand}.js`))
                if (cmd.modalexecute) {
                    cmd.modalexecute(interaction);
                    return;
                }
            }
        }
        if ((interaction.channel.id != process.env.CHANNELID) && (interaction.channel.id != process.env.CHANNELIDDEV)) { 
            interaction.reply({ content: `Please use these commands over in <#${process.env.CHANNELID}>.`, flags: discord.MessageFlags.Ephemeral })
            return;
        }
        if (commandFiles.includes(`${interaction.commandName}.js`)) {
            const cmd = require(path.join(commandsPath, `${interaction.commandName}.js`))
            cmd.execute(interaction);
        }
    }
    catch (err) {
        console.log(err);
    }
})

client.login(process.env.DISCORDBOTTOKEN)