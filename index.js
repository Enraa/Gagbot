const discord = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()

const fs = require('fs');
const path = require('path');
const https = require('https');
const { garbleMessage, setUpGags, modifymessage, loadMittenTypes } = require(`./functions/gagfunctions.js`);
const { handleKeyFinding } = require('./functions/keyfindingfunctions.js');
const { restartChastityTimers } = require('./functions/timelockfunctions.js');
const { loadHeavyTypes } = require('./functions/heavyfunctions.js');
const { loadHeadwearTypes } = require('./functions/headwearfunctions.js')
const { setUpCorsets } = require('./functions/corsetfunctions.js');
const { assignMemeImages, generateListTexts } = require('./functions/interactivefunctions.js');
const { backupsAreAnnoying, saveFiles, processUnlockTimes, processTimedEvents, importFileNames, scavengeUsers, removeOldMessages } = require('./functions/timefunctions.js');
const { loadEmoji } = require("./functions/messagefunctions.js");
const { loadWearables } = require("./functions/wearablefunctions.js");
const { setGlobalCommands, loadWebhooks } = require('./functions/configfunctions.js');
const { setUpToys } = require('./functions/toyfunctions.js');
const { setUpChastity } = require('./functions/chastityfunctions.js');
const { loadCollarTypes } = require('./functions/collarfunctions.js');
const { buttonboard } = require('./contextcommands/message/Button Board.js');
const { setUpEventFunctions } = require('./functions/eventhandling.js');
const { getBotOption } = require('./functions/getters/config/getBotOption.js');
const { getAllJoinedGuilds } = require("./functions/getters/config/getAllJoinedGuilds.js");
const { logConsole } = require('./functions/logfunctions.js');
const { markForSave } = require('./functions/other/markForSave.js');
const { processdatatoload } = require(`./lists/processdatatoload.js`);
const { addBellCollarReact } = require('./functions/setters/collar/addBellCollarReact.js');
const { setRecentChannel } = require(`./functions/setters/config/setRecentChannel.js`);
const { setProcessVariable } = require('./functions/setters/config/setProcessVariable.js');

// Prevent node from killing us immediately when we do the next line.
process.stdin.resume();

// I've never considered overriding this before lol
// This catches control+C and other manual ways of killing the application.
process.on('SIGINT', () => {
    try {
        console.log('Received SIGINT. Performing graceful shutdown...');
        saveFiles();
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
// This should catch a SIGTERM emitted as part of spinning down Docker
process.on('SIGTERM', () => {
    try {
        console.log('Received SIGTERM. Performing graceful shutdown...');
        saveFiles();
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
// This catches program crashes. Note, we're not stopping the program from
// killing itself, but we will attempt to write out the CURRENT state
// of all process variables to their appropriate files. 
// This method runs immediately BEFORE an uncaughtException. Note anything we do here must be sync.
process.on('uncaughtExceptionMonitor', (err,origin) => {
    if (GagbotSavedFileDirectory) {
        console.error(`Uncaught Exception. Performing "graceful" shutdown...`)
        saveFiles();
        if (!fs.existsSync(`${process.GagbotSavedFileDirectory}/crashlog.txt`)) {
            fs.writeFileSync(`${process.GagbotSavedFileDirectory}/crashlog.txt`, "Start of Crash Log")
        }
        let exceptionlog = `\n${new Date().toString()} -------------------------------`
        exceptionlog = `${exceptionlog}\nUncaught exception:\n${err.stack}`
        fs.appendFileSync(`${process.GagbotSavedFileDirectory}/crashlog.txt`, exceptionlog)
    }
})

// Assign nsfwflag to true. /debug process.nsfwflag = false to forcibly set nsfw commands to sfw. Not recommended, Discord API says this is not allowed.
process.nsfwflag = true

// If they never changed from the default in .env.md, use base directory. 
if (process.env.GAGBOTFILEDIRECTORY === "Z:\\Somewhere\\I\\Belong\\") { process.env.GAGBOTFILEDIRECTORY = "." }
let GagbotSavedFileDirectory = process.env.GAGBOTFILEDIRECTORY ? process.env.GAGBOTFILEDIRECTORY : __dirname

process.GagbotSavedFileDirectory = GagbotSavedFileDirectory // Because honestly, I dont know WHY global stuff in index.js can't be accessble everywhere

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

// Later loaders for autocompletes
setUpGags();
loadHeavyTypes(); 
loadHeadwearTypes();
loadMittenTypes();
loadCollarTypes();
loadWearables();
assignMemeImages();

setUpToys();
setUpChastity();
setUpCorsets();

// Build the Overview
process.helpmodals = {
    "Overview": (userid, page) => {
        // This is broken down into two pages on purpose, to ensure its not a HUGE block of info.
        // We need to handle this appropriately. 
        let overviewtext = [`## Basic Gagbot Commands Reference:
### Alter Speech:
**/gag**, **/ungag**: Gag someone or yourself, garbling speech in various ways.
**/toy**, **/untoy**: Apply a toy to someone or yourself, causing stuttered speech from arousal.
**/corset**, **/uncorset**: Apply a tightly laced corset, limiting sentence length in each message.
### Restrict access to commands above:
**/mitten**, **/unmitten**: Wear mittens, preventing yourself from changing gags or masks.
**/chastity**, **/unchastity**: Wear chastity, preventing changes to toys and corsets without the key.
**/heavy**, **/unheavy**: Wear heavy bondage, preventing access to most commands. `,`### Others:
**/mask**, **/unmask**: Varying effects, many of these block emotes in speech or inspect. Requires collar access if not on self.
**/collar**, **/uncollar**: Add or remove a collar, which can be set to allow users to /collarequip you, allowing them to do the commands in the above section. 
**/collarequip**: Apply a restraint listed in the above section to another person. Requires collar access.
**/key**: Transfer, clone or revoke cloned keys from a restraint you have the primary key for.
**/inspect**: Look at what a user is wearing or keys they're holding. 
**/config**: Modify various settings about you on the bot. 
**/struggle**: Get a fun little text. Does not have any actual effect on restraint status.
**/letgo**: Clear arousal, with a different text if at orgasm threshold. 
**/timelock**: Timelock a keyed restraint.
**/wear**, **/unwear**, **/outfit**: Adjust clothing, outfits and more!
**/item**: Protect or unprotect items from being removed with /unwear.
**/pronouns**: Set your pronouns for the bot's text feedback.`]
        if (!overviewtext[page]) page = 0;
        overviewtextdisplay = new discord.TextDisplayBuilder().setContent(overviewtext[page])
        let optionbuttons = [
            // Page Down
            new discord.ButtonBuilder()
                .setCustomId(`help_Overview_0`)
                .setLabel("← Prev Page")
                .setStyle(discord.ButtonStyle.Secondary)
                .setDisabled(page != 1),
            // Page Up
            new discord.ButtonBuilder()
                .setCustomId(`help_Overview_1`)
                .setLabel("Next Page →")
                .setStyle(discord.ButtonStyle.Secondary)
                .setDisabled(page != 0),
        ];
        return [overviewtextdisplay, new discord.ActionRowBuilder().addComponents(...optionbuttons)];
    }
}


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
    if (cmd.help) process.helpmodals[file.slice(0,1).toUpperCase() + file.slice(1).replace(".js","")] = cmd.help;
}

// Grab any context menu interactions
const usercontextcommands = new Map();
const usercontextcommandsPath = path.join(__dirname, 'contextcommands', "user");
const usercontextcommandsFiles = fs.readdirSync(usercontextcommandsPath).filter(file => file.endsWith('.js'));
for (const file of usercontextcommandsFiles) {
    const cmd = require(path.join(usercontextcommandsPath, file));
    if ((cmd.execute) && (cmd.data)) {
        usercontextcommands.set(cmd.data.name, cmd);
    }
}

// Grab any context menu interactions
const messagecontextcommands = new Map();
const messagecontextcommandsPath = path.join(__dirname, 'contextcommands', "message");
const messagecontextcommandsFiles = fs.readdirSync(messagecontextcommandsPath).filter(file => file.endsWith('.js'));
for (const file of messagecontextcommandsFiles) {
    const cmd = require(path.join(messagecontextcommandsPath, file));
    if ((cmd.execute) && (cmd.data)) {
        messagecontextcommands.set(cmd.data.name, cmd);
    }
    if (cmd.modalexecute) modalHandlers.set(file, cmd);
}

var gagged = {}

const client = new discord.Client({
    intents: [
        // Used to exist in servers, at all
        discord.GatewayIntentBits.Guilds,
        // Used to detect message info from servers
        discord.GatewayIntentBits.GuildMessages,
        // PRIVILEGED INTENT - Used to see contents of messages sent
        discord.GatewayIntentBits.MessageContent,
        // Used to receive interactions
        discord.GatewayIntentBits.GuildMessageReactions,
    ],
    // Partials specify if we can receive data on older stuff
    partials: [discord.Partials.Message, discord.Partials.Reaction, discord.Partials.User] 
})

client.on("clientReady", async () => {
    // This is run once we’re logged in!
    process.client = client;
    console.log(`Logged in as ${client.user.tag}!`)
    // Please stop crashing
    if (process.webhook == undefined) { process.webhook = {} }
    if (process.recentmessages == undefined) { process.recentmessages = {} }
    try {
        await client.application.fetch();
        await client.guilds.fetch();
        console.log(`Bot is owned by user ID ${client?.application?.owner.id}`)
        console.log(`Executable Functions: [${Array.from(commands.keys()).join(", ")}]`);
        console.log(`Modals: [${Array.from(modalHandlers.keys()).join(", ")}]`);
        console.log(`Components: [${Array.from(componentHandlers.keys()).join(", ")}]`);
        console.log(`Autocompletes: [${Array.from(autocompletehandlers.keys()).join(", ")}]`);
        // Load emoji into the application's emoji manager
        loadEmoji(client);

        // Load the /config function globally, as we can handle that whereever. 
        setGlobalCommands(client);

        // Check which guilds we're in!
        getAllJoinedGuilds(client);

        // Load webhooks
        await loadWebhooks(client);
        //console.log(`Webhook Channels: [${Array.from(process.webhook.keys()).join(", ")}]`)

        generateListTexts();

        scavengeUsers(client);
        setInterval(() => {
            try {
                scavengeUsers(client);
            }
            catch (err) { console.log(err) }
            try {
                removeOldMessages();
            }
            catch (err) { console.log(err) }
        }, 3600000);
        process.headpatcritchancebonus = 0.0;
        setInterval(() => {
            try {
                process.headpatcritchancebonus = process.headpatcritchancebonus + 0.001
            }
            catch (err) { console.log(err) }
        }, 6000)
    } 
    catch (err) {
        console.log(err)
    }
    process.timetick = setInterval(() => {
        processTimedEvents()
    }, getBotOption("bot-timetickrate") ?? 6000)
})

client.on("messageCreate", async (msg) => {
    // This is called when a message is received.
    try {
        if (msg.author.bot || msg.webhookId || msg.stickers?.first()) { return };
        let channelid = msg.channelId;
        let thread = false;
        if (msg.channel.isThread()) {
            thread = true
            channelid = msg.channel.parentId
        }
        if (process.webhook[channelid]) {
            if ((getBotOption("bot-allowkeyfinding") == "Enabled")) {
                handleKeyFinding(msg);
            }
            setRecentChannel(msg.guild.id, msg.user.id, msg.channel.id, "message");
            modifymessage(msg, thread ? msg.channelId : null);
        }
        if ((msg.channel.id != process.env.CHANNELID && msg.channel.parentId != process.env.CHANNELID) || (msg.webhookId) || (msg.author.bot) || (msg.stickers?.first()) || (message.flags && message.flags.has(discord.MessageFlags.HasSnapshot)) || (message.flags && message.flags.has(discord.MessageFlags.IsCrosspost))) { return }
    }
    catch (err) {
        console.log(err);
    }
})

client.on('interactionCreate', async (interaction) => {
    try {
        // Handle general interactions from a user
        if (interaction.channelId && interaction.guildId && interaction.user && interaction.user.id) {
            setRecentChannel(interaction.guildId, interaction.user.id, interaction.channelId, "interaction");
        }
        // Handle User targeted actions from context menu
        if (interaction.channelId && interaction.guildId && interaction.user && interaction.targetId && (interaction.commandType == 2)) {
            setRecentChannel(interaction.guildId, interaction.targetId, interaction.channelId, "interaction");
        }
        // Handle Message targeted headpats
        if (interaction.channelId && interaction.guildId && interaction.user && interaction.targetId && (interaction.commandType == 3)) {
            let channel = await interaction.client.channels.fetch(interaction.channelId)
            if (channel) {
                let message = await channel.messages.fetch(interaction.targetId)
                if (message) {
                    setRecentChannel(interaction.guildId, message.author.id, interaction.channelId, "interaction");
                }
            }
        }
        if (interaction.isUserContextMenuCommand()) {
            usercontextcommands.get(`${interaction.commandName}`)?.execute(interaction)
            return;
        }

        if (interaction.isMessageContextMenuCommand()) {
            messagecontextcommands.get(`${interaction.commandName}`)?.execute(interaction)
            return;
        }

        if (interaction.isModalSubmit()) {
            // We can't pass custom data through the modal except via the ID, so separate out the first part
            // as IDs will come in like collar_12451251253 - we want the collar part to query the command. 
            let interactioncommand = interaction.customId.split("_")[0]
            if (interactioncommand == "webhookedit") {
                interactioncommand = "Edit Message"
            }
            else if (interactioncommand == "modalevent") {
                if (process.eventfunctions) {
                    let eventfunctionset = interaction.customId.split("_")[1].split("|")[0]
                    let filecommand = interaction.customId.split("_")[1].split("|")[1]
                    if (process.eventfunctions[eventfunctionset] && process.eventfunctions[eventfunctionset][filecommand] && process.eventfunctions[eventfunctionset][filecommand].modalexecute) {
                        process.eventfunctions[eventfunctionset][filecommand].modalexecute(interaction);
                    }
                }
            }
            modalHandlers.get(`${interactioncommand}.js`)?.modalexecute(interaction);
            return;
        }
      
        if (interaction.isMessageComponent()) {
            // Lazy workaround for config handling, that will probably stand the test of time. 
            if (interaction.customId.startsWith("config_")) {
                let configfunc = require(`./commands/config.js`)
                configfunc.interactionresponse(interaction);  
            }
            else if (interaction.customId.startsWith("list_")) {
                let configfunc = require(`./commands/list.js`)
                configfunc.interactionresponse(interaction);  
            }
            else if (interaction.customId.startsWith("scoreboard_")) {
                let configfunc = require(`./commands/scoreboard.js`)
                configfunc.interactionresponse(interaction);  
            }
            else if (interaction.customId.startsWith("outfitter_")) {
                let configfunc = require(`./commands/outfit.js`)
                configfunc.interactionresponse(interaction);  
            }
            else if (interaction.customId.startsWith("inspect_")) {
                let configfunc = require(`./commands/inspect.js`)
                configfunc.interactionresponse(interaction);  
            }
            else if (interaction.customId.startsWith("help_")) {
                let configfunc = require(`./commands/help.js`)
                configfunc.interactionresponse(interaction); 
            }
            else if (interaction.customId.startsWith("key_")) {
                let configfunc = require(`./commands/key.js`)
                configfunc.interactionresponse(interaction); 
            }
            else if (interaction.customId.startsWith("delve_")) {
                let configfunc = require(`./commands/delve.js`)
                configfunc.interactionresponse(interaction); 
            }
            else if (interaction.customId.startsWith("extraconfig_")) {
                let eventfunctionset = interaction.customId.split("_")[1].split("|")[0]
                let filecommand = interaction.customId.split("_")[1].split("|")[1]
                if (process.eventfunctions[eventfunctionset] && process.eventfunctions[eventfunctionset][filecommand] && process.eventfunctions[eventfunctionset][filecommand].extraconfigresponse) {
                    process.eventfunctions[eventfunctionset][filecommand].extraconfigresponse(interaction);
                }
            }
            else if (interaction.customId.startsWith("buttonboard")) {
                buttonboard(interaction); // The button board reply function is in contextcommands/message/Button Board.js
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
        
        if (interaction.commandName === "config") {
            commands.get(interaction.commandName)?.execute(interaction);
            return;
        }

        let channelid = interaction.channelId;
        let thread = false;
        if (interaction.channel.isThread()) {
            thread = true
            channelid = interaction.channel.parentId
        }

        if (process.webhook[channelid]) {
            commands.get(interaction.commandName)?.execute(interaction);
            return;
        }
        else {
            interaction.reply({ content: `Please use this command in a channel that's setup for it.`, flags: discord.MessageFlags.Ephemeral })
            return;
        }
    }
    catch (err) {
        console.log(err);
    }
})

client.on(`messageReactionAdd`, async (react, user, details) => {
    if (user.bot) { return } // We dont care about bot reacts. 

    // If the react is a partial from an uncached message, try to get the full picture
    if (react.partial) {
        try {
            await react.fetch();
        }
        catch (err) {
            console.log(err);
        }
    }

    if (!process.webhook[react.message.channelId]) { return } // We only wanna handle messages in webhooks we know about.

    addBellCollarReact(react, user, details);
})

client.on(`guildDelete`, async (guild) => {
    try {
        if (process.joinedguilds.includes(guild.id)) {
            process.joinedguilds.splice(process.joinedguilds.indexOf(guild.id, 1))
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        if (process.configs.servers[guild.id]) {
            delete process.configs.servers[guild.id]
        }
    }
    catch (err) {
        console.log(err);
    }
})

client.on(`guildCreate`, async (guild) => {
    getAllJoinedGuilds(client) // Rebuild the list!
})

// I refuse to use a proper database with backups. 
// This is a solution to backup the terrible database. 
backupsAreAnnoying();
let backupset = setInterval(() => {
    backupsAreAnnoying()
}, parseInt(process.env.BACKUPDELAY ?? 3600000)) // Backups every one hour, or time specified in .env

let savefileset = setInterval(() => {
    saveFiles();
}, parseInt(process.env.SAVEDELAY ?? 60000)) // Backups every one hour, or time specified in .env

if (process.webhook) {
    process.webhook = {};
}

//importFileNames();

// new event system
setUpEventFunctions();

client.login(process.env.DISCORDBOTTOKEN)