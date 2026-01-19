const { ButtonStyle, ActionRowBuilder, SectionBuilder, StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, PermissionsBitField, MessageFlags,
    RoleSelectMenuBuilder,TextDisplayBuilder, ChannelSelectMenuBuilder, 
    REST, Routes, ButtonBuilder, ModalBuilder, LabelBuilder, TextInputBuilder,
    TextInputStyle} = require("discord.js")
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
            menutype: "choice",
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
            menutype: "choice",
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
            menutype: "choice",
            default: "disabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") } // if true, button is greyed out
        },
        "blessed-luck": {
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
            menutype: "choice",
            default: "enabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") }
        },
        "arousaleffectpotency": {
            name: "Arousal Effect Potency",
            desc: "How much should arousal modify your speech?",
            choices: [
                {
                    name: "Very Little",
                    helptext: "*33% of base*",
                    select_function: (userID) => { return false },
                    value: 0.33,
                    style: ButtonStyle.Secondary,
                    uname: "ArousalEffect033"
                },
                {
                    name: "Less",
                    helptext: "*66% of base*",
                    select_function: (userID) => { return false },
                    value: 0.66,
                    style: ButtonStyle.Secondary,
                    uname: "ArousalEffect066"
                },
                {
                    name: "Normal",
                    helptext: "100% of base",
                    select_function: (userID) => { return false },
                    value: 1.00,
                    style: ButtonStyle.Primary,
                    uname: "ArousalEffect100"
                },
                {
                    name: "More",
                    helptext: "133% of base",
                    select_function: (userID) => { return false },
                    value: 1.33,
                    style: ButtonStyle.Primary,
                    uname: "ArousalEffect133"
                },
                {
                    name: "Much More",
                    helptext: "166% of base",
                    select_function: (userID) => { return false },
                    value: 1.66,
                    style: ButtonStyle.Primary,
                    uname: "ArousalEffect166"
                },
                {
                    name: "Too Much...",
                    helptext: "200% of base",
                    select_function: (userID) => { return false },
                    value: 2.00,
                    style: ButtonStyle.Danger,
                    uname: "ArousalEffect200"
                },
            ],
            menutype: "choice",
            default: 1.00,
            disabled: (userID) => { return (getOption(userID,"arousalsystem") == 0) }
        }
    },
    "General": {
        "keygiving": {
            name: "Key Giving",
            desc: "Are keyholders allowed to give your keys to others? You must have DMs from this server turned on to utilize this option.",
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
            menutype: "choice",
            default: "prompt",
            disabled: () => { return false }
        },
        "removebondage": {
            name: "Prompt to Modify Non-Keyed Bondage",
            desc: "Should you be prompted for others to **/ungag** you, etc? You must have DMs from this server turned on to utilize this option.",
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
                    style: ButtonStyle.Danger,
                    uname: "RemoveBondageAuto"
                },
            ],
            menutype: "choice",
            default: "accept",
            disabled: () => { return false }
        },
        "publicaccess": {
            name: "Public Access",
            desc: "Can you put on a free use collar or enable public access timelocks?",
            choices: [
                {
                    name: "No",
                    helptext: "*Public Access is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "PublicAccessDisabled"
                },
                {
                    name: "Yes",
                    helptext: "**⚠️ You can select public access options on collars and timelocks!**",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Success,
                    uname: "PublicAccess"
                }
            ],
            menutype: "choice",
            default: "disabled",
            disabled: (userID) => { return false } // if true, button is greyed out
        },
        "revokeconsent": {
            name: "Revoke Consent",
            desc: "Revoke your consent from the bot? You will need to consent again to bondage in the future.",
            choices: [
                {
                    name: "Revoke",
                    helptext: "*Revoking helptext that'll never be used lol*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "KeyGivingDisabled"
                },
            ],
            menutype: "choice_revokeconsent",
            default: "disabled",
            disabled: () => { return false }
        }
    },
    "Misc": {
        "dollvisorname": {
            name: "Doll Visor Name",
            desc: "Set a custom name for Doll Visor name tags.",
            descmodal: "What should your tag display as in Doll Visor? Your default Doll tag is CUSTOMTEXT.",
            choices: [
                {
                    name: "Set Name",
                    helptext: "Doll Visor name is set to ",
                    helptextnone: "*Doll Visor name has not been set*",
                    select_function: (userID) => { return false },
                    value: "None",
                    style: ButtonStyle.Primary
                },
            ],
            customtext: (userID) => { return `DOLL-${userID.slice(-4)}` },
            placeholder: (userID) => { return `DOLL-${userID.slice(-4)}` },
            menutype: "choice_textentry",
            default: (userID) => { return `DOLL-${userID.slice(-4)}` },
            disabled: () => { return false }
        },
        "dollvisorcolor": {
            name: "Doll Visor Color",
            desc: "Set the color your Doll Visor designation will display as.",
            choices: [
                {
                    name: "Gray",
                    value: 30,
                    style: ButtonStyle.Primary
                },
                {
                    name: "Red",
                    value: 31,
                    style: ButtonStyle.Primary
                },
                {
                    name: "Green",
                    value: 32,
                    style: ButtonStyle.Primary
                },
                {
                    name: "Yellow",
                    value: 33,
                    style: ButtonStyle.Primary
                },
                {
                    name: "Blue",
                    value: 34,
                    style: ButtonStyle.Primary
                },
                {
                    name: "Pink",
                    value: 35,
                    style: ButtonStyle.Primary
                },
                {
                    name: "Cyan",
                    value: 36,
                    style: ButtonStyle.Primary
                },
                {
                    name: "White",
                    value: 37,
                    style: ButtonStyle.Primary
                }
            ],
            menutype: "choice_dollcolor",
            default: 34,
            disabled: () => { return false }
        },
        "dollforcedit": {
            name: "Doll Visor Forced Pronouns",
            desc: "Should the Doll Visor force you to use it/its pronouns when worn?",
            choices: [
                {
                    name: "No",
                    helptext: "*Doll Visor will not affect pronouns*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "DollVisorForcedNo"
                },
                {
                    name: "Yes",
                    helptext: "You will use it/its pronouns while wearing a visor",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary,
                    uname: "DollVisorForced"
                },
            ],
            menutype: "choice",
            default: "enabled",
            disabled: (userID) => { return false }
        },
        "dollforcedprotocol": {
            name: "Doll Visor Forced Protocol",
            desc: "Should the Doll Visor punish you for speaking in first person?  Punishments escalate with each violation, and can apply mittens and heavy restraints!",
            choices: [
                {
                    name: "No",
                    helptext: "*Doll Visor will not punish the wearer*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger,
                    uname: "DollVisorPunishNo"
                },
                {
                    name: "Warn",
                    helptext: "Doll Visor will warn on violations, but not punish",
                    select_function: (userID) => { return false },
                    value: "warning",
                    style: ButtonStyle.Secondary,
                    uname: "DollVisorPunishNo"
                },
                {
                    name: "Yes",
                    helptext: "Doll Visor will punish the wearer. This can apply mittens and heavy!",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary,
                    uname: "DollVisorPunish"
                },
            ],
            menutype: "choice",
            default: "disabled",
            disabled: (userID) => { return false }
        },
        "dollpunishthresh": {
            name: "Doll Protocol Punishment Threshold",
            desc: "How many protocol violations before the Doll Visor punishes?",
            choices: [
                {
                    name: "1 Violation",
                    helptext: "Every violation is a punishment",
                    select_function: (userID) => { return false },
                    value: 1,
                    style: ButtonStyle.Danger,
                    uname: "DollVisor1x"
                },
                {
                    name: "2 Violations",
                    helptext: "Every 2 violations",
                    select_function: (userID) => { return false },
                    value: 2,
                    style: ButtonStyle.Danger,
                    uname: "DollVisor2x"
                },
                {
                    name: "3 Violations",
                    helptext: "Every 3 violations",
                    select_function: (userID) => { return false },
                    value: 3,
                    style: ButtonStyle.Secondary,
                    uname: "DollVisor3x"
                },
                {
                    name: "4 Violations",
                    helptext: "Every 4 violations",
                    select_function: (userID) => { return false },
                    value: 4,
                    style: ButtonStyle.Secondary,
                    uname: "DollVisor4x"
                },
                {
                    name: "5 Violations",
                    helptext: "Every 5 violations",
                    select_function: (userID) => { return false },
                    value: 5,
                    style: ButtonStyle.Secondary,
                    uname: "DollVisor5x"
                },
            ],
            menutype: "choice",
            default: 3,
            disabled: (userID) => { return false }
        }
    },
    "Extreme": {
        "extreme-heavy-doll_processing": {
            name: "Heavy - Doll Processing Facility",
            desc: "Creates Dolls by applying Cyber Doll restraints and appropriate gear",
            prompttext: `Doll Processing involves removing all clothing from the wearer. **Everything that isn't locked will be designated to be removed, with a handful of Doll specific exceptions.**\n\nAdditionally, the Facility will apply various restraints, including a chastity belt, chastity bra, collar and a doll visor. Where possible, this will be keyed to the person who put you in the facility, or yourself.`,
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Doll Processing is disabled*",
                    select_function: (interaction, serverID) => { return false },
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted when this is put on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "Prompt",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Prompt (Others)",
                    helptext: "You will be prompted when others put this on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "PromptOthers",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Enabled",
                    helptext: "⚠️ You will automatically accept this restraint",
                    select_function: (interaction, serverID) => { return false },
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                }
            ],
            menutype: "choice",
            default: "Prompt",
            disabled: () => { return false }
        },
        "extreme-heavy-costumer_mimic": {
            name: "Heavy - Costumer Mimic",
            desc: "Changes you into a themed outfit. Can include other extreme restraints.",
            prompttext: `Costumer Mimics can change you into a a random outfit, which may include other extreme restraints such as the Polite Sub gag. The resulting outfit does not adjust to anything worn and cannot be influenced once tossed in.`,
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Costumer Mimics are disabled*",
                    select_function: (interaction, serverID) => { return false },
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted when this is put on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "Prompt",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Prompt (Others)",
                    helptext: "You will be prompted when others put this on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "PromptOthers",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Enabled",
                    helptext: "⚠️ You will automatically accept this restraint",
                    select_function: (interaction, serverID) => { return false },
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                }
            ],
            menutype: "choice",
            default: "Prompt",
            disabled: () => { return false }
        },
        "extreme-gag-politeSub": {
            name: "Gag - Polite Sub",
            desc: "Enforces the use of Honorifics to speak",
            prompttext: `Polite Sub Gags will force you to address people with honorifics. Examples of this include "Miss," "Sir", "Lady", "Administrator" and so on. Failing to put an honorific in your message will result in the entire message being discarded for a submissive emote instead.`,
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Polite Sub Gag is disabled*",
                    select_function: (interaction, serverID) => { return false },
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted when this is put on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "Prompt",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Prompt (Others)",
                    helptext: "You will be prompted when others put this on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "PromptOthers",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Enabled",
                    helptext: "⚠️ You will automatically accept this restraint",
                    select_function: (interaction, serverID) => { return false },
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                }
            ],
            menutype: "choice",
            default: "Prompt",
            disabled: () => { return false }
        },
        "extreme-gag-goodSub": {
            name: "Gag - Good Sub",
            desc: "Fully prevents communication, forced deferent speech",
            prompttext: `Good Sub gags will fully prevent you from saying anything meaningful. All speech is forced into phrases that demonstrate submissiveness towards owners.`,
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Good Sub Gag is disabled*",
                    select_function: (interaction, serverID) => { return false },
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted when this is put on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "Prompt",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Prompt (Others)",
                    helptext: "You will be prompted when others put this on you",
                    select_function: (interaction, serverID) => { return false },
                    value: "PromptOthers",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Enabled",
                    helptext: "⚠️ You will automatically accept this restraint",
                    select_function: (interaction, serverID) => { return false },
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                }
            ],
            menutype: "choice",
            default: "Prompt",
            disabled: () => { return false }
        }
    },
    "Server": {
        "server-allowgags": {
            name: "Allow Gags",
            desc: "Allows **/gag** and **/ungag**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Gags are disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Gags are enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-allowmitten": {
            name: "Allow Gags",
            desc: "Allows **/mitten** and **/unmitten**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Mittens are disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Mittens are enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-allowvibe": {
            name: "Allow Vibes",
            desc: "Allows **/vibe** and **/unvibe**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Vibrators are disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Vibrators are enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-allowchastity": {
            name: "Allow Chastity",
            desc: "Allows **/chastity** and **/unchastity**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Chastity is disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Chastity is enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-allowcorset": {
            name: "Allow Corsets",
            desc: "Allows **/corset** and **/uncorset**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Corsets are disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Corsets are enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-allowhead": {
            name: "Allow Headwear",
            desc: "Allows **/mask** and **/unmask**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Headgear is disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Headgear is enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-allowapparel": {
            name: "Allow Apparel",
            desc: "Allows **/wear** and **/unwear**",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Apparel is disabled*",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Apparel is enabled",
                    select_function: (interaction, serverID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_server",
            default: "Enabled",
            disabled: () => { return false }
        },
        "server-refreshcmd": {
            name: "REFRESH COMMANDS",
            desc: `commands`,
            menutype: "choice_server_refreshcmd",
            default: [],
            disabled: () => { return false }
        },
        "server-channelspermitted": {
            name: "Allowed Channels",
            desc: `Which channels to allow Gagbot to interact with. Gagbot __MUST__ have **Manage Messages** and **Manage Webhooks** permissions in the channel.`,
            menutype: "choice_server_channels",
            default: [],
            disabled: () => { return false }
        },
        "server-safewordroleid": {
            name: "Safeword Role",
            desc: "Which role must be assigned to self reset with **/reset**",
            menutype: "choice_server_role",
            default: "",
            disabled: () => { return false }
        },
        // And so on for other features
    },
    "Bot": {
        "bot-enablebot": {
            name: "Global Enable Bot",
            desc: "Should the bot be active and respond to messages?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Bot will not respond to messages*",
                    select_function: (userID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "✔️ Bot responds to messages",
                    select_function: (userID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Success
                },
            ],
            menutype: "choice_bot",
            default: "Enabled",
            disabled: () => { return false }
        },
        "bot-allownewsetup": {
            name: "Allow New Setups",
            desc: "Can server owners set this bot up on a new guild?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Bot will not allow new setups except from you*",
                    select_function: (userID) => { return false }, // We will need to have this update commands
                    value: "Disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "⚠️ Bot will allow new setups if added to server",
                    select_function: (userID) => { return false }, // We will need to have this update commands
                    value: "Enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_bot",
            default: "Disabled",
            disabled: () => { return false }
        },
        "bot-timetickrate": {
            name: "Time Tick Rate",
            desc: "How fast to calculate arousal and timelocks?",
            choices: [
                {
                    name: "200ms",
                    helptext: "***Every 200 milliseconds (may lag)***",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 200,
                    style: ButtonStyle.Danger
                },
                {
                    name: "500ms",
                    helptext: "***Every 500 milliseconds (may lag)***",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 500,
                    style: ButtonStyle.Danger
                },
                {
                    name: "1 Second",
                    helptext: "*Every second (may lag)*",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 1000,
                    style: ButtonStyle.Danger
                },
                {
                    name: "2 Seconds",
                    helptext: "Every 2 seconds",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 2000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "5 Seconds",
                    helptext: "Every 5 seconds",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 5000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "10 Seconds",
                    helptext: "Every 10 seconds",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 10000,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "30 Seconds",
                    helptext: "Every 30 seconds",
                    select_function: () => { return false }, // We will need to update tick rate with this
                    value: 30000,
                    style: ButtonStyle.Secondary
                },
            ],
            menutype: "choice_bot",
            default: 2000,
            disabled: () => { return false }
        }
    }
} 

function generateConfigModal(interaction, menuset = "General", page, statustext) {
    console.log("Start of generate config modal")
    return new Promise(async (res,rej) => {
        let pagecomponents = [];

        if (process.configs == undefined) { process.configs = {} } 
        if (process.configs.servers == undefined) { process.configs.servers = {} } 

        Object.keys(configoptions[menuset]).forEach(async (k) => {
            if (configoptions[menuset][k].menutype == "choice") {
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.helptext}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_pageopt_${menuset}_${k}`)
                            .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.name ?? "Undefined")
                            .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.style ?? ButtonStyle.Danger)
                            .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
                    )
                pagecomponents.push(buttonsection)
            }
            /*else if (configoptions[menuset][k].menutype == "choice_extreme") {
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.helptext}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_pageopt_${menuset}_${k}`)
                            .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.name ?? "Undefined")
                            .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.style ?? ButtonStyle.Danger)
                            .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
                    )
                pagecomponents.push(buttonsection)
            }*/
            else if (configoptions[menuset][k].menutype == "choice_textentry") {
                let helpertext = `${configoptions[menuset][k].choices[0].helptext}${getOption(interaction.user.id,k)}`
                if (getOption(interaction.user.id,k) == undefined) {
                    helpertext = `${configoptions[menuset][k].choices[0].helptextnone}`
                }
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices[0].helptext}${getOption(interaction.user.id,k)}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_tentrypageopt_${menuset}_${k}`)
                            .setLabel(configoptions[menuset][k].choices[0].name ?? "Undefined")
                            .setStyle(configoptions[menuset][k].choices[0].style ?? ButtonStyle.Danger)
                            .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
                    )
                pagecomponents.push(buttonsection)
            }
            if (configoptions[menuset][k].menutype == "choice_dollcolor") {
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\`\`\`ansi\n[1;${getOption(interaction.user.id,k)}m${getOption(interaction.user.id,"dollvisorname")}: [0mIt is speaking.\`\`\``)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_pageopt_${menuset}_${k}`)
                            .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.name ?? "Undefined")
                            .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.style ?? ButtonStyle.Danger)
                            .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
                    )
                pagecomponents.push(buttonsection)
            }
            else if (configoptions[menuset][k].menutype == "choice_server_refreshcmd") {
                if (process.configs.servers[interaction.guildId] != undefined) {
                    let button = new ButtonBuilder()
                        .setCustomId(`config_refreshcmdButton_${k}`)
                        .setLabel(`Refresh Commands${(getServerCmdRefresh(interaction.guildId) > 0) ? ` (Wait ${getServerCmdRefresh(interaction.guildId)}s)` : ""}`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled((getServerCmdRefresh(interaction.guildId) > 0))
                    pagecomponents.push(new ActionRowBuilder().addComponents(button))
                }
            }
            else if (configoptions[menuset][k].menutype == "choice_server") {
                if (process.configs.servers[interaction.guildId] != undefined) {
                    let buttonsection = new SectionBuilder()
                        .addTextDisplayComponents(
                            (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getServerOption(interaction.guildId,k))?.helptext}`)
                        )
                        .setButtonAccessory((button) =>
                            button.setCustomId(`config_spageopt_${menuset}_${k}`)
                                .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getServerOption(interaction.guildId,k))?.name)
                                .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getServerOption(interaction.guildId,k))?.style)
                                .setDisabled(configoptions[menuset][k].disabled(interaction.guildId))
                        )
                    pagecomponents.push(buttonsection)
                }
            }
            else if (configoptions[menuset][k].menutype == "choice_server_channels") {
                if (process.configs.servers[interaction.guildId] != undefined) {
                    let currentrole = "Select allowed channels..."
                    let channelsmentioned = [];
                    if (getServerOption(interaction.guildId,"server-channelspermitted") && getServerOption(interaction.guildId,"server-channelspermitted").length > 0) {
                        channelsmentioned = getServerOption(interaction.guildId,"server-channelspermitted")
                    }
                    
                    let roledescription = new TextDisplayBuilder()
                        .setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}${statustext ? statustext : ""}`)
                    let component = new ChannelSelectMenuBuilder()
                                .setCustomId(`config_serveroptchannel_${menuset}_${k}`)
                                .setPlaceholder(currentrole)
                                .setMinValues(0)
                                .setMaxValues(25)

                    if (channelsmentioned && (channelsmentioned.length > 0)) {
                        component.setDefaultChannels(...[...new Set(channelsmentioned)]);
                    }
                    let rolesection = new ActionRowBuilder()
                        .addComponents(component)
                    pagecomponents.push(roledescription)
                    pagecomponents.push(rolesection)
                }
            }
            else if (configoptions[menuset][k].menutype == "choice_server_role") {
                if (process.configs.servers[interaction.guildId] != undefined) {
                    let currentrole = "Select safeword role..."
                    let rolefetched;
                    if (getServerOption(interaction.guildId,k) && getServerOption(interaction.guildId,k).length > 0) {
                        rolefetched = await interaction.guild.roles.fetch(getServerOption(interaction.guildId,k))
                    }
                    
                    let roledescription = new TextDisplayBuilder()
                        .setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}`)

                    let rolebit = new RoleSelectMenuBuilder()
                                .setCustomId(`config_serveroptrole_${menuset}_${k}`)
                                .setPlaceholder(currentrole)
                                .setMinValues(0)
                                .setMaxValues(1)

                    if (rolefetched) {
                        rolebit.setDefaultRoles(getServerOption(interaction.guildId,k));
                    }

                    let rolesection = new ActionRowBuilder()
                        .addComponents(rolebit)
                    
                    pagecomponents.push(roledescription)
                    pagecomponents.push(rolesection)
                }
                else {
                    // Create a text box explaining the server doesn't have a configuration yet
                    // And a shiny button to create a default. 
                    let disabled = ((getBotOption("bot-allownewsetup") == "Disabled") && (interaction.user.id != interaction.client.application.owner.id))
                    let noserverdescription = new TextDisplayBuilder()
                        .setContent(`### This server does not yet have a configuration. Click the button below to setup default settings.\nSetting up **${interaction.guild.name}**`)
                    let button = new ButtonBuilder()
                        .setCustomId(`config_createnewconfig_${menuset}_${k}`)
                        .setLabel(`Create Default Config`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(disabled);
                    let noserverdescription2 = new TextDisplayBuilder()
                        .setContent((disabled) ? `-# The bot's owner has forbidden new installations except from them. Please contact them for initial setup.` : `-# You will then be able to use slash commands here.`)
                    pagecomponents.push(noserverdescription);
                    pagecomponents.push(new ActionRowBuilder().addComponents(button))
                    pagecomponents.push(noserverdescription2);
                }
            }
            else if (configoptions[menuset][k].menutype == "choice_bot") {
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getBotOption(k))?.helptext}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_bpageopt_${menuset}_${k}`)
                            .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getBotOption(k))?.name)
                            .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getBotOption(k))?.style)
                            .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
                    )
                pagecomponents.push(buttonsection)
            }
            else if (configoptions[menuset][k].menutype == "choice_revokeconsent") {
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_pageoptrevoke_${menuset}`)
                            .setLabel(`Revoke Consent`)
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled((process.consented[interaction.user.id] == undefined))
                    )
                pagecomponents.push(buttonsection)
            }
        })

        // If bot owner, construct a selector for servers here and allow them to create defaults and then to leave after.
        await interaction.client.application.fetch();
        if (menuset == "Bot" && (interaction.user.id == interaction.client.application.owner.id)) {
            let choicegap = new TextDisplayBuilder()
                        .setContent(`‎`)
            pagecomponents.push(choicegap)
            let allguilds;
            try { allguilds = Array.from(await interaction.client.guilds.fetch()).map((m) => m[1].id).sort((a,b) => { return a-b }).slice(0,8) } catch (err) { allguilds = [] }
            console.log(allguilds)
            allguilds.forEach(async (g) => {
                console.log(g)
                let guildresolved = await interaction.client.guilds.fetch(g);
                //console.log(guildresolved);
                let guildapps;
                try {
                    guildapps = await guildresolved.commands.fetch()
                    guildapps = guildapps.map((m) => { return { name: m.name, desc: m.description, guildId: m.guildId, id: m.id }})
                } catch (err) { guildapps = [] }

                let guildappsset = ((guildapps.length) > 0) ? true : false;
                console.log(guildapps.length);
                console.log(guildappsset)
                //guildapps = guildapps.map((m) => { return { name: m.name, desc: m.description, guildId: m.guildId, id: m.id }})
                let guildsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`### ${guildappsset ? "Delete Config in " : "Create Default in "}${guildresolved.name}\n-# ‎   ⤷ ${guildappsset ? `Loaded with ${guildapps.length} commands` : `*Not Active on this Server*`}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_botguilds_${menuset}_${g}_${guildappsset ? "delete" : "setup"}`)
                            .setLabel(guildappsset ? "Delete Config" : "Setup Default Config")
                            .setStyle(guildappsset ? ButtonStyle.Danger : ButtonStyle.Primary)
                    )
                console.log(guildsection);
                pagecomponents.push(guildsection)
            })
            // For whatever STUPID reason, it isn't adding it because of async
            // So going to forcibly ***wait***. This is *terrible* design. 
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            await sleep(1000); // Pauses for 1000 milliseconds
        }

        // Create Menu Selector 
        let pagemenutext = menuset;
        // Construct the menu selector
        let menupageoptions = new StringSelectMenuBuilder()
            .setCustomId('config_menuselector')
        
        let menupageoptionsarr = []
        Object.keys(configoptions).forEach((k) => {
            if ((k != "Server") && (k != "Bot")) {
                let opt = new StringSelectMenuOptionBuilder()
                    .setLabel(k)
                    .setValue(`menuopt_${k}`)
                menupageoptionsarr.push(opt)
            }
        })

        // If the user is a moderator on that server, allow configuration of that server
        // Note, they must have global manage messages permission.
        let inguild = false;
        try {
            await interaction.client.guilds.fetch(interaction.guildId);
            inguild = true;
        }
        catch (err) { 
            // Probably not in a guild, so dont add this bit lol
            // console.log(err)
        }
        if (inguild && interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            let opt = new StringSelectMenuOptionBuilder()
                .setLabel("Server Settings")
                .setValue(`menuopt_Server`)
            menupageoptionsarr.push(opt)
            // Set the page text to prettier if this is on their settings
            if (menuset == "Server") {
                pagemenutext = "Server Settings"
            }
        }

        // If the user is the owner of the bot
        // The application should already be retrieved during the index.js initialization. 
        if (interaction.user.id == interaction.client.application.owner.id) {
            let opt = new StringSelectMenuOptionBuilder()
                .setLabel("Bot Settings")
                .setValue(`menuopt_Bot`)
            menupageoptionsarr.push(opt)
            // Set the page text to prettier if this is on their settings
            if (menuset == "Bot") {
                pagemenutext = "Bot Settings"
            }
        }

        menupageoptions.setPlaceholder(pagemenutext)

        // Add all of the available options we have for the menu selection
        menupageoptions.addOptions(...menupageoptionsarr);

        pagecomponents.push(new ActionRowBuilder()
            .addComponents(menupageoptions)
        )

        res({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
    }).then((res) => {
        return res;
    })
}

function setOption(userID, option, choice) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { process.configs.users[userID] = {} } 
    process.configs.users[userID][option] = choice;
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

function getOption(userID, option) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { 
        process.configs.users[userID] = {} 
        initializeOptions(userID)
    } 
    if (process.configs.users[userID][option] == undefined) {
        let pages = ["Arousal", "General", "Misc", "Extreme"];
        pages.forEach((p) => {
            let optionspages = Object.keys(configoptions[p]);
            optionspages.forEach((k) => {
                if (k == option) { 
                    if (typeof configoptions[p][k].default == "function") {
                        process.configs.users[userID][k] = configoptions[p][k].default(userID);
                    }
                    else {
                        process.configs.users[userID][k] = configoptions[p][k].default 
                    }
                }
            })
        })
        if (process.readytosave == undefined) { process.readytosave = {} }
        process.readytosave.configs = true;
    }
    return process.configs.users[userID][option];
}

function initializeOptions(userID) {
    let pages = ["Arousal", "General", "Misc", "Extreme"];
    pages.forEach((p) => {
        let optionspages = Object.keys(configoptions[p]);
        optionspages.forEach((k) => {
            if (typeof configoptions[p][k].default == "function") {
                process.configs.users[userID][k] = configoptions[p][k].default(userID);
            }
            else {
                process.configs.users[userID][k] = configoptions[p][k].default 
            }
        })
    })
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

function setServerOption(serverID, option, choice) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.servers == undefined) { process.configs.servers = {} } 
    if (process.configs.servers[serverID] == undefined) { process.configs.servers[serverID] = {} } 
    process.configs.servers[serverID][option] = choice;
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

function getServerOption(serverID, option) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.servers == undefined) { process.configs.servers = {} } 
    if (process.configs.servers[serverID] == undefined) { 
        console.log("reinitting " + option)
        process.configs.servers[serverID] = {} 
        initializeServerOptions(serverID)
    } 
    if (process.configs.servers[serverID][option] == undefined) {
        Object.keys(configoptions["Server"]).forEach((k) => {
            if (k == option) { process.configs.servers[serverID][k] = configoptions["Server"][k].default }
        })
        if (process.readytosave == undefined) { process.readytosave = {} }
        process.readytosave.configs = true;
    }
    return process.configs.servers[serverID][option];
}

function initializeServerOptions(serverID) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.servers == undefined) { process.configs.servers = {} } 
    if (process.configs.servers[serverID] == undefined) { process.configs.servers[serverID] = {} } 
    Object.keys(configoptions["Server"]).forEach((k) => {
        process.configs.servers[serverID][k] = configoptions["Server"][k].default
    })
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

function setBotOption(option, choice) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.botglobal == undefined) { process.configs.botglobal = {} } 
    process.configs.botglobal[option] = choice;
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

function getBotOption(option) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.botglobal == undefined) { 
        console.log("Setting up global bot settings")
        initializeBotOptions()
    } 
    if (process.configs.botglobal[option] == undefined) {
        Object.keys(configoptions["Bot"]).forEach((k) => {
            if (k == option) { process.configs.botglobal[k] = configoptions["Bot"][k].default }
        })
        if (process.readytosave == undefined) { process.readytosave = {} }
        process.readytosave.configs = true;
    }
    return process.configs.botglobal[option];
}

function initializeBotOptions() {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.botglobal == undefined) { process.configs.botglobal = {} }  
    Object.keys(configoptions["Bot"]).forEach((k) => {
        process.configs.botglobal[k] = configoptions["Bot"][k].default
    })
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

// Leave from the guild as if we never existed... which is just delete the properties here.
function leaveServerOptions(serverID) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.servers == undefined) { process.configs.servers = {} } 
    delete process.configs.servers[serverID]
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.configs = true;
}

// Wholesale remove all commands from a guild. 
async function removeAllCommands(interaction, serverID) {
    try {
        let guild = await interaction.client.guilds.fetch(serverID);
        await guild.commands.set([]);
        console.log(`Successfully discarded application (/) commands for server ID ${serverID}.`);
    }
    catch (err) { console.log(err) }
}

// Returns 0, or however many seconds
function getServerCmdRefresh(serverID) {
    if (process.servercmdcooldown == undefined) { process.servercmdcooldown = {} }
    if (process.servercmdcooldown[serverID]) {
        console.log(process.servercmdcooldown[serverID].date - (Math.floor(performance.now())))
        return Math.floor(Math.max(Math.min((Math.floor(process.servercmdcooldown[serverID].date - (Math.floor(performance.now()))) / 1000), 300), 0));
    }
    return 0;
}

// Syncs commands for server, with disabled options removing their 
// appropriate functions. 
async function setCommands(interaction, serverID) {
    // Grab all the command files from the commands directory
    const commands = {};
    const commandsPath = path.join(__dirname, "..", 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const command = require(`./../commands/${file}`);
        if ((command.execute) && (command.data)) {
            commands[file] = command;
        }
        else {
            console.log(`Ignoring file at ./../commands/${file} because it does not have either a data or an execute export.`)
        }
    }

    // We have config globally deployed, dont have it in the guild's list lol
    delete commands["config.js"];

    // Now go through each server option (if available) and remove entries if disabled.
    if (getServerOption(serverID, "server-allowgags") == "Disabled") {
        delete commands["gag.js"];
        delete commands["ungag.js"];
    }
    if (getServerOption(serverID, "server-allowmitten") == "Disabled") {
        delete commands["mitten.js"];
        delete commands["unmitten.js"];
    }
    if (getServerOption(serverID, "server-allowvibe") == "Disabled") {
        delete commands["vibe.js"];
        delete commands["unvibe.js"];
        delete commands["letgo.js"]
    }
    if (getServerOption(serverID, "server-allowchastity") == "Disabled") {
        delete commands["chastity.js"];
        delete commands["unchastity.js"];
    }
    if (getServerOption(serverID, "server-allowcorset") == "Disabled") {
        delete commands["corset.js"];
        delete commands["uncorset.js"];
    }
    if (getServerOption(serverID, "server-allowhead") == "Disabled") {
        delete commands["mask.js"];
        delete commands["unmask.js"];
    }
    if (getServerOption(serverID, "server-allowapparel") == "Disabled") {
        delete commands["wear.js"];
        delete commands["unwear.js"];
    }
    if ((getServerOption(serverID, "server-allowapparel") == "Disabled") && (getServerOption(serverID, "server-allowhead") == "Disabled")) {
        delete commands["item.js"];
    }

    console.log(Object.keys(commands))

    let commandsforrest = [];
    Object.keys(commands).forEach((k) => {
        commandsforrest.push(commands[k].data.toJSON())
    })
    console.log(commandsforrest)

    // Set up the REST route to overwrite the commands list for that server with our new one.
    try {
        // Run this bit asynchronously while we set up cooldown and hand back to user. 
        (async () => {
            console.log(`Trying to put ${commandsforrest.length} commands into ${serverID}`)
            console.log(interaction.client.user.id)
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORDBOTTOKEN);
            const data = await rest.put(
                Routes.applicationGuildCommands(interaction.client.user.id, serverID),
                    { body: commandsforrest },
                ).catch((err) => { console.log(err) });
            console.log(`Successfully reloaded ${data.length} application (/) commands into server ID ${serverID}.`);
        })();

        console.log(Math.floor(performance.now() + 60000))

        if (process.servercmdcooldown == undefined) { process.servercmdcooldown = {} }
        process.servercmdcooldown[serverID] = { date: Math.floor(performance.now() + 60000) /* 1 Min cooldown */ }
        setTimeout(() => {
            delete process.servercmdcooldown[serverID];
        }, 60000);
    } catch (err) { console.log(err) }
}

async function setGlobalCommands(client) {
    await client.application.fetch()
    let clientcommands = await client.application.commands.fetch()
    clientcommands = clientcommands.map((m) => { return { name: m.name, desc: m.description, id: m.id }})
    if ((clientcommands.length > 1) || !(clientcommands[0]?.name == "config")) {
        const command = require(`./../commands/config.js`);
        if ((command.execute) && (command.data)) {
            commandlist = [command.data.toJSON()];
        }
        else {
            console.log(`Ignoring file at ./../commands/${file} because it does not have either a data or an execute export.`)
        }
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORDBOTTOKEN);
        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
                { body: commandlist },
            ).then(() => {
                `Pushed Config command to global.`
            }).catch((err) => { console.log(err) });
    }
}

function knownServer(serverID) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.servers == undefined) { process.configs.servers = {} } 
    return (process.configs.servers[serverID] != undefined)
}

// Tries to find a webhook by the name "Gagbot" to use it, or creates a new one
// Returns an object with webhook info or none if it cannot be made. 
async function createWebhook(interaction, channel) {
    try {
        // First, check if we can manage webhooks. If we can't, vamos. 
        if (!channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageWebhooks)) {
            return false;
        }

        // We're now reasonably sure we can make webhooks. 
        // Check if a Gagbot webhook already exists. If it does, use it.
        let existingwebhooks = await channel.fetchWebhooks();
        let webhook;
        let humanwebhook;
        // Use a user-made webhook first if available
        existingwebhooks.forEach((w) => {
            console.log(existingwebhooks)
            console.log(`ISBOT: ${(w.applicationId != interaction.client.user.id)}, ISNAME: ${(w.name == "Gagbot")}`)
            if ((w.applicationId != interaction.client.user.id) && (w.name == "Gagbot")) { 
                webhook = w 
                humanwebhook = true;
            }
        })
        // Use an existing bot created webhook if available.
        if (!webhook) {
            existingwebhooks.forEach((w) => {
                if (w.applicationId == interaction.client.user.id) { 
                    webhook = w 
                    humanwebhook = false;
                }
            })
        }
        // A gagbot webhook does not exist. Create one. 
        if (!webhook) {
            webhook = await channel.createWebhook({
                name: "Gagbot Webhook",
                reason: "Auto-generated Webhook for Gagbot"
            })
        }
        if (process.webhook == undefined) { process.webhook = {} }
        if (process.webhookstoload == undefined) { process.webhookstoload = {} }
        process.webhook[channel.id] = webhook;
        process.webhookstoload[channel.id] = webhook.id;
        if (process.readytosave == undefined) { process.readytosave = {} }
        process.readytosave.webhooks = true;
        console.log(process.webhookstoload);
        return { humanwebhook: humanwebhook };
    }
    catch (err) {
        console.log(err)
        return false;
    }
}

async function deleteWebhook(interaction, channel) {
    // First, check if we can manage webhooks. If we can't, vamos. 
    if (!channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageWebhooks)) {
        return false;
    }
    let webhook;
    let existingwebhooks = await channel.fetchWebhooks();
    existingwebhooks.forEach((w) => {
        if (w.id == process.webhook[channel.id]) {
            webhook = w;
        }
    })
    delete process.webhook[channel.id];
    delete process.webhookstoload[channel.id];
    if (webhook) {
        if (webhook.w.applicationId == interaction.client.user.id) {
            await interaction.client.deleteWebhook(webhook.id);
            return "bot";
        }
        else {
            return "notbot";
        }
    }
    return false;
}

// Load all known webhooks into the list 
function loadWebhooks(client) {
    Object.keys(process.webhookstoload).forEach(async (w) => {
        try {
            if (process.webhook == undefined) { process.webhook = {} }
            process.webhook[w] = await client.fetchWebhook(process.webhookstoload[w])
        }
        catch (err) {
            // Webhook is invalid. Delete it. We'll catch issues later. 
            console.log(err)
        }
    })
}

// Recieves an interaction, with desctext and the optionval referencing 
// the option name to pass into setOption. We will want to store this
// interaction along with data. Data must supply at least title, page, and desctext props. 
function generateTextEntryModal(interaction, data, optionval) {
    if (process.recentinteraction == undefined) { process.recentinteraction = {}}
    process.recentinteraction[interaction.user.id] = {
        interaction: interaction,
        timestamp: performance.now() // If the interaction was at least 15 minutes ago (900000 ms), invalidate it. 
    }

    const modal = new ModalBuilder().setCustomId(`config_setoptionmodal_${data.page}_${optionval}`).setTitle(`Enter Option...`);
    
    // Text part to tell the user what it is 
    /*let maintextpart = new TextDisplayBuilder()
    let maintext = `${data.desctext}`
    maintext.setContent(maintextpart)*/

    // Text Entry for the choice
    const choicetextentry = new TextInputBuilder()
            .setCustomId('choiceinput')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(data.placeholder ?? 'Enter option value...')
            .setRequired(true)

    const labeltextentry = new LabelBuilder()
        .setLabel(`${data.title}`)
        .setDescription(`${data.desctext}`)
        .setTextInputComponent(choicetextentry)

    // Put it all together
    //modal.addTextDisplayComponents(maintext)

    modal.addLabelComponents(labeltextentry)

    return modal;
}

exports.generateConfigModal = generateConfigModal;
exports.generateTextEntryModal = generateTextEntryModal;
exports.configoptions = configoptions;
exports.getOption = getOption;
exports.setOption = setOption;

exports.getServerOption = getServerOption;
exports.setServerOption = setServerOption;

exports.getBotOption = getBotOption;
exports.setBotOption = setBotOption;

exports.initializeServerOptions = initializeServerOptions;

exports.removeAllCommands = removeAllCommands;
exports.setCommands = setCommands;
exports.setGlobalCommands = setGlobalCommands;

exports.knownServer = knownServer;
exports.leaveServerOptions = leaveServerOptions;

exports.createWebhook = createWebhook;
exports.deleteWebhook = deleteWebhook;
exports.loadWebhooks = loadWebhooks;

const functions = {};

Object.entries(configoptions).forEach(([_, page]) => {
    Object.entries(page).forEach(([key, option]) => {
        if (option.choices) {
            option.choices.forEach((choice) => {
                functions[`get${choice.uname}`] = (user) => getOption(user, key) == choice.value
            })
        }
    })
});

exports.config = functions;
