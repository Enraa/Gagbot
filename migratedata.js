const dotenv = require('dotenv')
dotenv.config()
/*********
 * This function should be called in order to read all of the currently saved files and generate new ones in an alternate path.
 * Please specify the path below before runtime. This will grab data from .env to run. This migration should only need to be performed once.
 * 
 * Please note, this requires the GUILD MEMBERS privileged intent bit, which is NOT normally needed for running the bot. 
 * 
 *********/
const discord = require('discord.js')
const fs = require(`fs`);
const { processdatatoload } = require('./lists/processdatatoload')

if (process.env.GAGBOTFILEDIRECTORY === "Z:\\Somewhere\\I\\Belong\\") { process.env.GAGBOTFILEDIRECTORY = "." }
let GagbotSavedFileDirectory = process.env.GAGBOTFILEDIRECTORY ? process.env.GAGBOTFILEDIRECTORY : __dirname

process.GagbotSavedFileDirectory = GagbotSavedFileDirectory // Because honestly, I dont know WHY global stuff in index.js can't be accessble everywhere

const newdatapath = `${process.GagbotSavedFileDirectory}/datamigration`

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

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.MessageContent,
        discord.GatewayIntentBits.GuildMembers
    ]
})

client.on("clientReady", async () => {
    process.client = client;
    await client.application.fetch();
    await client.guilds.fetch();
    console.log(`Bot is owned by user ID ${client?.application?.owner.id}`)
    let guildsmapped = client.guilds.cache.map(guild => guild.id);
    // First, iterate over each guild, getting a current list of members
    for (const guild of client.guilds.cache.values()) {
        console.log(guild.id);
        let members = await guild.members.fetch();
        let membersmapped = members.map((m) => m.id);
        membersmapped.forEach((member) => {
            // For each member, check if they have the respective object.
            processdatatoload.forEach((pd) => {
                if (pd.processvar && pd.hasusers) {
                    if (!guildsmapped.includes(member) && (process[pd.processvar] && process[pd.processvar][member])) {
                        if (process[pd.processvar][guild.id] == undefined) {
                            process[pd.processvar][guild.id] = {};
                        }
                        process[pd.processvar][guild.id][member] = structuredClone(process[pd.processvar][member])
                    }
                }
            })
            // This is a specific fix for configs. 
            if (process.configs && process.configs.users) {
                if (!guildsmapped.includes(member) && process.configs.users[member]) {
                    if (process.configs.users[guild.id] == undefined) { process.configs.users[guild.id] = {} }
                    process.configs.users[guild.id][member] = structuredClone(process.configs.users[member]);
                }
            }
        })
    };
    // Second, delete any non-guild ID from our data sets if the target would have users
    processdatatoload.forEach((pd) => {
        if (pd.processvar && pd.hasusers) {
            Object.keys(process[pd.processvar]).forEach((member) => {
                if (!guildsmapped.includes(member)) { 
                    delete process[pd.processvar][member];
                }
            })
        }
    })
    // Thirdly, check process.configs.users for non server user info and trim it. 
    Object.keys(process.configs.users).forEach((pc) => {
        if (!guildsmapped.includes(pc)) {
            delete process.configs.users[pc];
        }
    })
    // Finally, attempt to save all of the data we loaded. 
    processdatatoload.forEach((pd) => {
        let filepath = `${newdatapath}/${pd.textname}`
        fs.writeFileSync(filepath, JSON.stringify(process[pd.processvar]));
    })
    console.log(`Completed with migration`)
    process.exit();
})


client.login(process.env.DISCORDBOTTOKEN)