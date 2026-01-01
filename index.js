const discord = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()

const fs = require('fs');
const path = require('path');
const https = require('https');
const { assignMitten, garbleMessage, gagtypesset } = require(`./functions/gagfunctions.js`);
const { handleKeyFinding } = require('./functions/keyfindingfunctions.js');
const { restartChastityTimers } = require('./functions/timelockfunctions.js');
const { loadHeavyTypes } = require('./functions/heavyfunctions.js');
const { loadHeadwearTypes } = require('./functions/headwearfunctions.js')
const { assignCorset } = require('./functions/corsetfunctions.js');
const { assignMemeImages } = require('./functions/interactivefunctions.js');
const { updateArousalValues } = require('./functions/vibefunctions.js');

let GagbotSavedFileDirectory = process.env.GAGBOTFILEDIRECTORY ? process.env.GAGBOTFILEDIRECTORY : __dirname

process.GagbotSavedFileDirectory = GagbotSavedFileDirectory // Because honestly, I dont know WHY global stuff in index.js can't be accessble everywhere

let processdatatoload = [
    { textname: "gaggedusers.txt", processvar: "gags", default: {} },
    { textname: "mittenedusers.txt", processvar: "mitten", default: {} },
    { textname: "chastityusers.txt", processvar: "chastity", default: {} },
    { textname: "vibeusers.txt", processvar: "vibe", default: {} },
    { textname: "collarusers.txt", processvar: "collar", default: {} },
    { textname: "heavyusers.txt", processvar: "heavy", default: {} },
    { textname: "pronounsusers.txt", processvar: "pronouns", default: {} },
    { textname: "usersdata.txt", processvar: "usercontext", default: {} },
    { textname: "consentusers.txt", processvar: "consented", default: {} },
    { textname: "corsetusers.txt", processvar: "corset", default: {} },
    { textname: "arousal.txt", processvar: "arousal", default: {} },
    { textname: "headwearusers.txt", processvar: "headwear", default: {} },
    { textname: "discardedkeys.txt", processvar: "discardedKeys", default: [] },
    { textname: "configs.txt", processvar: "configs", default: {}},
    { textname: "dollusers.txt", processvar: "dolloverrides", default: {}}
]

processdatatoload.forEach((s) => {
    try {
        if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/${s.textname}`)) {
            fs.writeFileSync(`${process.GagbotSavedFileDirectory}/${s.textname}`, JSON.stringify(s.default))
        }
        process[s.processvar] = JSON.parse(fs.readFileSync(`${process.GagbotSavedFileDirectory}/${s.textname}`))
    }
    catch (err) {
        console.log(`Error loading ${s.textname}`)
        console.log(err)
    }
})
  
try {
    // return lost keys since keyfinding changed
    for (const key in process.chastity) {
        if (process.chastity[key].oldKeyholder) process.chastity[key].keyholder = process.chastity[key].oldKeyholder;
    }
    for (const key in process.collar) {
        if (process.collar[key].oldKeyholder) process.collar[key].keyholder = process.collar[key].oldKeyholder;
    }
}
catch (err) { 
    console.log(err);
}

try {
    // add breath values for old corsets, this only needs to run once
    for (const user in process.corset) {
        if (!process.corset[user].breath) assignCorset(user, process.corset[user]?.tightness);
    }
} catch (err) { 
    console.log(err);
}

// Fixing code because I'm a terrible coder
Object.keys(process.mitten).forEach((m) => {
    if (process.mitten[m] === true) {
        assignMitten(m, undefined);
    }
})

// Later loaders for autocompletes
gagtypesset();
loadHeavyTypes(); 
loadHeadwearTypes();
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
    try {
        await client.application.fetch();
        console.log(`Bot is owned by user ID ${client?.application?.owner.id}`)
        console.log(`Executable Functions: [${Array.from(commands.keys()).join(", ")}]`);
        console.log(`Modals: [${Array.from(modalHandlers.keys()).join(", ")}]`);
        console.log(`Components: [${Array.from(componentHandlers.keys()).join(", ")}]`);
        console.log(`Autocompletes: [${Array.from(autocompletehandlers.keys()).join(", ")}]`);
    }
    catch (err) {
        console.log(err)
    }
    restartChastityTimers(client);
    setInterval(updateArousalValues, Number(process.env.AROUSALSTEPSIZE ?? 6000));
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
            // Lazy workaround for config handling, that will probably stand the test of time. 
            if (interaction.customId.startsWith("config_")) {
                let configfunc = require(`./commands/config.js`)
                configfunc.interactionresponse(interaction);  
            }
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