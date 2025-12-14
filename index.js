const discord = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');
const https = require('https');
const { garbleMessage } = require(`./functions/gagfunctions.js`)

dotenv.config()

try {
    if (!fs.existsSync(`./gaggedusers.txt`)) {
        fs.writeFileSync(`./gaggedusers.txt`, JSON.stringify({}))
    }
    process.gags = JSON.parse(fs.readFileSync(`./gaggedusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`./mittenedusers.txt`)) {
        fs.writeFileSync(`./mittenedusers.txt`, JSON.stringify({}))
    }
    process.mitten = JSON.parse(fs.readFileSync(`./mittenedusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`./chastityusers.txt`)) {
        fs.writeFileSync(`./chastityusers.txt`, JSON.stringify({}))
    }
    process.chastity = JSON.parse(fs.readFileSync(`./chastityusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`./vibeusers.txt`)) {
        fs.writeFileSync(`./vibeusers.txt`, JSON.stringify({}))
    }
    process.vibe = JSON.parse(fs.readFileSync(`./vibeusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`./collarusers.txt`)) {
        fs.writeFileSync(`./collarusers.txt`, JSON.stringify({}))
    }
    process.collar = JSON.parse(fs.readFileSync(`./collarusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`./heavyusers.txt`)) {
        fs.writeFileSync(`./heavyusers.txt`, JSON.stringify({}))
    }
    process.heavy = JSON.parse(fs.readFileSync(`./heavyusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`./usersdata.txt`)) {
        fs.writeFileSync(`./usersdata.txt`, JSON.stringify({}))
    }
    process.usersdata = JSON.parse(fs.readFileSync(`./usersdata.txt`))
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