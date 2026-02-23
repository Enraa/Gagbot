const { ModalBuilder, UserSelectMenuBuilder, LabelBuilder } = require("discord.js");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { getPronouns } = require("../../functions/pronounfunctions");

exports.modal = async (interaction, userid) => {
    let modal = new ModalBuilder()
        .setCustomId(`modalevent_gasmasklinked_${interaction.user.id}_${userid}`)
        .setTitle(`Share Arousal`)
    let username = await interaction.guild.members.fetch(userid);
    if (!username) { username = { displayName: "the user" } }

    let outLabel = `Select target to share ${username.displayName}'s arousal to:`
    if (interaction.user.id == userid) {
        outLabel = `Select target to share your arousal to:`
    }
    const userselect = new UserSelectMenuBuilder()
        .setCustomId("userselection")
        .setPlaceholder("Share with...")
        .setMaxValues(1)
        .setRequired(true);

    const userselectlabel = new LabelBuilder()
        .setLabel(`Share Arousal with who?`)
        .setDescription(outLabel)
        .setUserSelectMenuComponent(userselect);

    modal.addLabelComponents(userselectlabel)

    return modal;
}

exports.modalexecute = async (interaction) => {
    interaction.deferUpdate();
    let interactionuser = interaction.member.id;
    let weareruser = interaction.customId.split("_")[3]
    let sharebreathuser = interaction.fields.getSelectedUsers("userselection") ? Array.from(interaction.fields.getSelectedUsers("userselection").keys())[0] : weareruser
    if (weareruser == sharebreathuser) {
        // They're the same person lol
        if (weareruser == interactionuser) {
            messageSendChannel(`<@${interaction.user.id}> holds onto ${getPronouns(interaction.user.id, "possessiveDeterminer")} gasmask tube for now...`, interaction.channelId)
        }
        else {
            messageSendChannel(`<@${interaction.user.id}> gives <@${weareruser}>'s gasmask tube to ${getPronouns(interaction.user.id, "object")} for now...`, interaction.channelId)
        }
    }
    else {
        if (weareruser == interactionuser) {
            if (process.headwear && process.headwear[sharebreathuser] && (process.headwear[sharebreathuser].sharedbreathhose == weareruser)) {
                // The other person already shared a breath with them, acknowledge that. 
                messageSendChannel(`<@${interaction.user.id}> takes the breath hose from <@${sharebreathuser}> and connects it to ${getPronouns(interaction.user.id, "possessiveDeterminer")} gasmask, limiting both of their abilities to get fresh air!`, interaction.channelId)
            }
            else {
                messageSendChannel(`<@${interaction.user.id}> gives ${getPronouns(interaction.user.id, "possessiveDeterminer")} gasmask tube to <@${sharebreathuser}>!`, interaction.channelId)
            }
            if (process.headwear[weareruser]) {
                process.headwear[weareruser].sharedbreathhose = sharebreathuser
            }
        }
        else {
            if (process.headwear && process.headwear[sharebreathuser] && (process.headwear[sharebreathuser].sharedbreathhose == weareruser)) {
                // The other person already shared a breath with them, acknowledge that. 
                messageSendChannel(`<@${interaction.user.id}> takes the breath hose from <@${sharebreathuser}> and connects it to <@${weareruser}>'s gasmask, limiting both of their abilities to get fresh air!`, interaction.channelId)
            }
            else {
                messageSendChannel(`<@${interaction.user.id}> gives <@${weareruser}>'s gasmask tube to <@${sharebreathuser}>!`, interaction.channelId)
            }
            if (process.headwear[weareruser]) {
                process.headwear[weareruser].sharedbreathhose = sharebreathuser
            }
        }
    }
}