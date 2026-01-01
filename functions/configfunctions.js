const { ButtonStyle, ActionRowBuilder, SectionBuilder, StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, PermissionsBitField, MessageFlags,
    RoleSelectMenuBuilder} = require("discord.js")
const fs = require('fs');
const path = require('path');
const https = require('https');

const configoptions = {
    "Arousal": {
        "arousalsystem": {
            name: "Arousal System",
            desc: "Which Arousal system to use?",
            choices: [
                {
                    name: "Off",
                    helptext: "*Arousal disabled*",
                    select_function: (userID) => { 
                        delete process.vibe[userID]
                    },
                    value: 0,
                    style: ButtonStyle.Danger,
                    uname: "DisableVibes"
                },
                {
                    name: "Static Arousal",
                    helptext: "Static Arousal (when vibed)",
                    select_function: (userID) => { return false },
                    value: 1,
                    style: ButtonStyle.Secondary,
                    uname: "StaticArousal"
                },
                {
                    name: "Dynamic Arousal",
                    helptext: "Dynamic Arousal",
                    select_function: (userID) => { return false },
                    value: 2,
                    style: ButtonStyle.Secondary,
                    uname: "DynamicArousal"
                }
            ],
            default: 2,
            disabled: () => { return false } // if true, button is greyed out
        },
        "fumbling": {
            name: "Key Fumbling",
            desc: "Who can fumble your keys (from Arousal) and fail to unlock you?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Fumbling is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "DisabledKeyFumbling"
                },
                {
                    name: "Self Only",
                    helptext: "Can fumble your own keys",
                    select_function: (userID) => { return false },
                    value: "self",
                    style: ButtonStyle.Secondary,
                    uname: "KeyFumblingSelf"
                },
                {
                    name: "Self and Others",
                    helptext: "You and others can fumble your keys",
                    select_function: (userID) => { return false },
                    value: "everyone",
                    style: ButtonStyle.Secondary,
                    uname: "KeyFumblingOthers"
                }
            ],
            default: "self",
            disabled: () => { return false } // if true, button is greyed out
        },
        "keyloss": {
            name: "Key Loss",
            desc: "Can fumbling keys cause the keys to be lost?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Key Loss is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "KeyLossDisabled"
                },
                {
                    name: "Enabled",
                    helptext: "**Your keys can be lost**",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary,
                    uname: "KeyLoss"
                }
            ],
            default: "disabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") } // if true, button is greyed out
        },
        "blessed_luck": {
            name: "Blessed Luck",
            desc: "Should failed rolls from fumbling contribute to future rolls?",
            choices: [
                {
                    name: "No",
                    helptext: "*Blessed Luck is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "BlessedLuckDisabled"
                },
                {
                    name: "Yes",
                    helptext: "Failed rolls add to future success chance",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary,
                    uname: "BlessedLuck"
                },
            ],
            default: "enabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") }
        }
    },
    "General": {
        "keygiving": {
            name: "Key Giving",
            desc: "Are keyholders allowed to give your keys to others?",
            choices: [
                {
                    name: "No",
                    helptext: "*Key giving is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "KeyGivingDisabled"
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted for key transfers",
                    select_function: (userID) => { return false },
                    value: "prompt",
                    style: ButtonStyle.Secondary,
                    uname: "KeyGivingPrompt"
                },
                {
                    name: "Automatic",
                    helptext: "⚠️ **You will accept keygiving requests automatically**",
                    select_function: (userID) => { return false },
                    value: "auto",
                    style: ButtonStyle.Secondary,
                    uname: "KeyGivingAuto"
                },
            ],
            default: "prompt",
            disabled: () => { return false }
        },
        "removebondage": {
            name: "Prompt to Modify Non-Keyed Bondage",
            desc: "Should you be prompted for others to **/ungag** you, etc?",
            choices: [
                {
                    name: "Everyone",
                    helptext: "Prompt for anyone to remove non-keyed bondage",
                    select_function: (userID) => { return false },
                    value: "all",
                    style: ButtonStyle.Secondary,
                    uname: "RemoveBondagePrompt"
                },
                {
                    name: "Everyone except Binder",
                    helptext: "Prompt for anyone besides who put something on you",
                    select_function: (userID) => { return false },
                    value: "all_binder",
                    style: ButtonStyle.Secondary,
                    uname: "RemoveBondageBinder"
                },
                {
                    name: "Everyone except Binder and Keyholder(s)",
                    helptext: "Prompt for anyone besides who put something on you or keyholders",
                    select_function: (userID) => { return false },
                    value: "all_binder_and_keyholder",
                    style: ButtonStyle.Secondary,
                    uname: "RemoveBondageKeyholder"
                },
                {
                    name: "Disabled",
                    helptext: "Automatically allow bondage to be removed",
                    select_function: (userID) => { return false },
                    value: "accept",
                    style: ButtonStyle.Secondary,
                    uname: "RemoveBondageAuto"
                },
            ],
            default: "accept",
            disabled: () => { return false }
        }
    },
    "Server Settings": {
        "server_allowgags": {
            name: "Allow Gags",
            desc: "Allows /gag and /ungag",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Gags are disabled*",
                    select_function: (serverID) => { return false } // We will need to have this update commands
                },
                {
                    name: "Enabled",
                    helptext: "Gags are enabled",
                    select_function: (serverID) => { return false } // We will need to have this update commands
                },
            ],
            default: "Enabled",
            disabled: () => { return false }
        } 
        // And so on for other features
    },
    "Bot Settings": {
        "bot_enablebot": {
            name: "Global Enable Bot",
            desc: "Should the bot be active and respond to messages",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Bot will not respond to messages*",
                    select_function: (userID) => { return false } // We will need to have this update commands
                },
                {
                    name: "Enabled",
                    helptext: "Bot responds to messages",
                    select_function: (userID) => { return false } // We will need to have this update commands
                },
            ],
            default: "Enabled",
            disabled: () => { return false }
        }
    }
} 

function generateConfigModal(interaction, menuset = "General", page) {
    // Construct the list of options for a given menu set
    let pagecomponents = [];
    Object.keys(configoptions[menuset]).forEach((k) => {
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents(
                (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}`),
                (textdisplay) => textdisplay.setContent(`${configoptions[menuset][k].desc}`),
                (textdisplay) => textdisplay.setContent(`-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.helptext}`)
            )
            .setButtonAccessory((button) =>
                button.setCustomId(`config_pageopt_${menuset}_${k}`)
                    .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.name)
                    .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.style)
                    .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
            )
        pagecomponents.push(buttonsection)
    })

    // If manage messages on the server, user is considered a moderator.
    // Give them server specific components, namely to designate a safeword role
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && menuset == "Server Settings") {
        let currrole // Get current safeword role that's set here
        pagecomponents.push(new ActionRowBuilder()
            .addComponents(new RoleSelectMenuBuilder()
                .setCustomId(`roleselectopt_${interaction.guildId}`)
                .setPlaceholder(`Select Safeword role for /reset`)
                .setMinValues(0)
                .setMaxValues(1)
                //.setDefaultRoles() -- Set the current safeword role here if theres one already
            )
        )
    }

    // If bot owner, construct a selector for servers here and allow them to make the client leave them

    // Construct the menu selector
    let menupageoptions = new StringSelectMenuBuilder()
        .setCustomId('config_menuselector')
        .setPlaceholder('Choose Menu Section')
    
    let menupageoptionsarr = []
    Object.keys(configoptions).forEach((k) => {
        if ((k != "Server Settings") && (k != "Bot Settings")) {
            let opt = new StringSelectMenuOptionBuilder()
                .setLabel(k)
                .setValue(`menuopt_${k}`)
            menupageoptionsarr.push(opt)
        }
    })

    // If the user is a moderator on that server, allow configuration of that server
    // Note, they must have global manage messages permission.
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel("Server Settings")
            .setValue(`menuopt_Server Settings`)
        menupageoptionsarr.push(opt)
    }

    // If the user is the owner of the bot
    // The application should already be retrieved during the index.js initialization. 
    if (interaction.user.id == interaction.client.application.owner.id) {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel("Bot Settings")
            .setValue(`menuopt_Bot Settings`)
        menupageoptionsarr.push(opt)
    }

    // Add all of the available options we have for the menu selection
    menupageoptions.addOptions(...menupageoptionsarr);

    pagecomponents.push(new ActionRowBuilder()
        .addComponents(menupageoptions)
    )

    return {
        components: pagecomponents,
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    }
}

function setOption(userID, option, choice) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { process.configs.users[userID] = {} } 
    process.configs.users[userID][option] = choice;
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
}

function getOption(userID, option) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { 
        process.configs.users[userID] = {} 
        initializeOptions(userID)
    } 
    if (process.configs.users[userID][option] == undefined) {
        let arousaloptionpages = Object.keys(configoptions["Arousal"])
        let generaloptionpages = Object.keys(configoptions["General"])
        arousaloptionpages.forEach((k) => {
            if (k == option) { process.configs.users[userID][k] = configoptions["Arousal"][k].default }
        })
        generaloptionpages.forEach((k) => {
            if (k == option) { process.configs.users[userID][k] = configoptions["General"][k].default }
        })
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
    }
    return process.configs.users[userID][option];
}

function initializeOptions(userID) {
    let arousaloptionpages = Object.keys(configoptions["Arousal"])
    let generaloptionpages = Object.keys(configoptions["General"])
    arousaloptionpages.forEach((k) => {
        process.configs.users[userID][k] = configoptions["Arousal"][k].default
    })
    generaloptionpages.forEach((k) => {
        process.configs.users[userID][k] = configoptions["General"][k].default
    })
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
}

exports.generateConfigModal = generateConfigModal;
exports.configoptions = configoptions;
exports.getOption = getOption;
exports.setOption = setOption;

const functions = {};

Object.entries(configoptions).forEach(([_, page]) => {
    Object.entries(page).forEach(([key, option]) => {
        option.choices.forEach((choice) => {
            functions[`get${choice.uname}`] = (user) => getOption(user, key) == choice.value
        })
    })
});

exports.config = functions;
