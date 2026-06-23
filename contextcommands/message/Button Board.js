const { ContextMenuCommandBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const { getTextGeneric } = require('../../functions/textfunctions');
const { getHeadwearRestrictions } = require('../../functions/getters/headwear/getHeadwearRestrictions');

function arrayShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr; 
}

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Button Board')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            let buttons = [
                [ "💢", "❔", "❕", "💕", "✅"],
                [ "🍔", "🔑", "🔒", "🔗", "🥽"],
                [ "👀", "🥺", "💤", "❌", "☕︎" ],
                [ `BOT|${process.emojis.armbinder}`, `BOT|${process.emojis.collar}`, `BOT|${process.emojis.chastity}`, `BOT|${process.emojis.gag}`, `BOT|${process.emojis.wand}` ],
                [ `BOT|${process.emojis.happymaid}`, `BOT|${process.emojis.yesh}`, `BOT|${process.emojis.tetowoah}`, `BOT|${process.emojis.miku}`, `BOT|${process.emojis.shyumm}` ],
            ]
            if (!getHeadwearRestrictions(interaction.guildId, interaction.user.id).canInspect) {
                buttons = buttons.map((ba) => {
                    console.log(ba);
                    return arrayShuffle(ba)
                })
                buttons = arrayShuffle(buttons);
            }
            console.log(buttons)
            let buttonmap = buttons.map((ba) => {
                return ba.map((bb) => {
                    let b = new ButtonBuilder()
                        .setCustomId(`buttonboard_${bb}`)
                        .setStyle(ButtonStyle.Secondary)
                    if (getHeadwearRestrictions(interaction.guildId, interaction.user.id).canInspect && bb.startsWith('BOT|')) {
                        b.setEmoji(bb.split("|")[1])
                    }
                    else {
                        b.setLabel(!getHeadwearRestrictions(interaction.guildId, interaction.user.id).canInspect ? "❓" : bb)
                    }
                    return b;
                })
            })
            let buttoncomponents = [];
            for (let i = 0; i < buttonmap.length; i++) {
                buttoncomponents[i] = new ActionRowBuilder().addComponents(...buttonmap[i])
            }
            interaction.reply({ components: buttoncomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
        } catch (err) {
            console.log(err);
        }
    },
    async buttonboard(interaction) {
        interaction.deferUpdate();
        // interaction.message.reference points to the message we evoked the board from!
        let buttonemoji = interaction.customId.split("_")[1]
        buttonemoji = buttonemoji.replace("BOT|", "")
        let data_in = {
            serverID: interaction.guildId, 
            interactionuser: interaction.user,
            targetuser: interaction.user,
            c1: buttonemoji,
            c2: getHeadwearRestrictions(interaction.guildId, interaction.user.id).canInspect ? "cansee" : "blind"
        }

        let channelwithmessage = interaction.client.channels.cache.get(interaction.channelId);
        channelwithmessage.messages.fetch(interaction.message.reference.messageId).then((msg) => {
            msg.reply(getTextGeneric(`buttonboard`, data_in))
        })
    }
}