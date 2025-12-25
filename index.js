const discord = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');
const https = require('https');
const { garbleMessage } = require(`./functions/gagfunctions.js`);
const { handleKeyFinding } = require('./functions/keyfindingfunctions.js');
const { restartChastityTimers } = require('./functions/timelockfunctions.js');
const { loadHeavyTypes } = require('./functions/heavyfunctions.js')
const { assignMemeImages } = require('./functions/interactivefunctions.js')

dotenv.config()

let GagbotSavedFileDirectory = process.env.GAGBOTFILEDIRECTORY ? process.env.GAGBOTFILEDIRECTORY : __dirname

process.GagbotSavedFileDirectory = GagbotSavedFileDirectory // Because honestly, I dont know WHY global stuff in index.js can't be accessble everywhere

console.log(fs.readdirSync(process.GagbotSavedFileDirectory))

try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/gaggedusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/gaggedusers.txt`, JSON.stringify({}))
    }
    process.gags = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/gaggedusers.txt`))
    // convert gags that were stored by tag instead of snowflake
    for (const key in process.gags) {
        const match = key.match(/\<\@(\d+)\>/);
        if (match) {
            const gag = process.gags[key];
            process.gags[match[1]] = gag;
            delete process.gags[key];
        }
    }
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/mittenedusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/mittenedusers.txt`, JSON.stringify({}))
    }
    process.mitten = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/mittenedusers.txt`))
    // convert mittens that were stored by tag instead of snowflake
    for (const key in process.mitten) {
        const match = key.match(/\<\@(\d+)\>/);
        if (match) {
            const gag = process.mitten[key];
            process.mitten[match[1]] = gag;
            delete process.mitten[key];
        }
    }
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify({}))
    }
    process.chastity = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`))
    // handle belts locked before frustration was being tracked, can be removed once this has been ran once
    for (const key in process.chastity) {
        if (!process.chastity[key].timestamp) process.chastity[key].timestamp = Date.now();
        if (!process.chastity[key].extraFrustration) process.chastity[key].extraFrustration = 0;
    }
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`, JSON.stringify({}))
    }
    process.vibe = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify({}))
    }
    process.collar = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`, JSON.stringify({}))
    }
    process.heavy = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`, JSON.stringify({}))
    }
    process.pronouns = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/usersdata.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/usersdata.txt`, JSON.stringify({}))
    }
    process.usersdata = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/usersdata.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`, JSON.stringify({}))
    }
    process.optins = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`, JSON.stringify({}))
    }
    // PLEASE GOD READ THIS
    process.consented = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`))

    console.log(process.consented)
} catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify({}))
    }
    process.corset = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`))
} catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/arousal.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify({}))
    }
    process.arousal = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`))
}
catch (err) { 
    console.log(err);
}
try {
    if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`)) {
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify({}))
    }
    process.keyfumbling = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`))
}
catch (err) { 
    console.log(err);
}

loadHeavyTypes();       // Load heavy types into memory for fast autocomplete access

loadHeavyTypes();       // Load heavy types into memory for fast autocomplete access
assignMemeImages();

// Grab all the command files from the commands directory
const commands = new Map();
const modalHandlers = new Map();
const componentHandlers = new Map();
const autocompletehandlers = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const cmd = require(path.join(commandsPath, file));
    if ((cmd.execute) && (cmd.data)) {
        commands.set(cmd.data.name, cmd);
    }
    if (cmd.modalexecute) modalHandlers.set(file, cmd);
    cmd.componentHandlers?.forEach((handler) => {
        componentHandlers.set(handler.key, handler);
    });
    if (cmd.autoComplete) autocompletehandlers.set(file, cmd);
}

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
    restartChastityTimers(client);
})

client.on("messageCreate", async (msg) => {
    // This is called when a message is received.
    try {
        console.log(`${(msg.channel.id != process.env.CHANNELID)}`)
        console.log(`${msg.webhookId}`)
        console.log(`${msg.author.bot}`)
        console.log(`${msg.stickers?.first()}`)
        console.log(`${msg.attachments?.first()}`)
        if ((msg.channel.id != process.env.CHANNELID && msg.channel.parentId != process.env.CHANNELID) || (msg.webhookId) || (msg.author.bot) || (msg.stickers?.first())) { return }
        //console.log(msg.member.displayAvatarURL())
        //console.log(msg.member.displayName)
        handleKeyFinding(msg);
        garbleMessage(msg.channel.isThread() ? msg.channelId : null, msg);
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
            modalHandlers.get(`${interactioncommand}.js`)?.modalexecute(interaction);
            return;
        }
      
        if (interaction.isMessageComponent()) {
            const [key, ...args] = interaction.customId.split("-");
            componentHandlers.get(key)?.handle(interaction, ...args);
            return;
        } 

        if (interaction.isAutocomplete()) {
            try {
                autocompletehandlers.get(`${interaction.commandName}.js`)?.autoComplete(interaction)
            }
            catch (err) {
                console.log(err);
            }
            return;
        }
      
        if ((interaction.channel.id != process.env.CHANNELID && interaction.channel.parentId != process.env.CHANNELID) && (interaction.channel.id != process.env.CHANNELIDDEV)) { 
            interaction.reply({ content: `Please use these commands over in <#${process.env.CHANNELID}>.`, flags: discord.MessageFlags.Ephemeral })
            return;
        }

        commands.get(interaction.commandName)?.execute(interaction);
    }
    catch (err) {
        console.log(err);
    }
})

client.login(process.env.DISCORDBOTTOKEN)