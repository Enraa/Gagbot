const { ButtonStyle, ButtonBuilder, ActionRowBuilder, TextDisplayBuilder, MessageFlags, UserSelectMenuBuilder, SectionBuilder } = require("discord.js");
const { getRestraintByUUID } = require("../functions/getters/lock/getRestraintByUUID");
const { getLockAwaiting } = require("../functions/getters/lock/getLockAwaiting");
const { updateLockAwaiting } = require("../functions/setters/lock/updateLockAwaiting");
const { removeLockAwaiting } = require("../functions/setters/lock/removeLockAwaiting");
const { applyLockAwaiting } = require("../functions/setters/lock/applyLockAwaiting");
const { getPronouns } = require("../functions/getters/config/getPronouns");
const { getItemName } = require("../functions/getters/config/getItemName");
const { sendLockToast } = require("../functions/setters/lock/sendLockToast");
const { getItemType } = require("../functions/getters/config/getItemType");
const { handleApplyLock } = require("../functions/lockfunctions");
const { checkLockAwaiting } = require("../functions/getters/lock/checkLockAwaiting");
const { getBaseLock } = require("../functions/getters/lock/getBaseLock");

/***********
 * This is a lock that only unlocks when the wearer performs X successful /letgo
 ***********/

// The condition to allow access to the item this lock is on
exports.canAccessLock = (data) => { 
    return false;
}

// The condition to allow adding clonedKeyholders
exports.canCloneKeys = (data) => {
    return false;
}

// The condition to allow removing clonedKeyholders
exports.canRemoveCloneKeys = (data) => {
    return false;
}

// The condition to allow transferring primary keyholder
exports.canTransfer = (data) => {
    return false;
}

// The condition to allow removing the lock
exports.canUnlock = (data) => {
    return false;
}

exports.initializeLock = function(data) {
    // Initialize it by setting the person who started this as the keyholder. 
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "restraintname", getItemName(lock.restraintobject));
    updateLockAwaiting(data.uuid, "orgasmMax", 3);
}

// Base Data
exports.name = "Orgasm Lock"
exports.locktype = "large"
exports.desc = `A lock that reacts to the wearer's hormonal outputs, opening only when a preconfigured number of endorphins rush over their body. The wearer will need to do **/letgo** a certain number of times to unlock the lock.`
exports.itemdescription = `### ${this.name}\n-# Type: **${this.locktype}**\n\n${this.desc}`

exports.lockinteraction = function (interaction, data, update = false) {
    let pagecomponents = [];

    // Main Title text
    let maintitle = new TextDisplayBuilder().setContent(`## Applying an Orgasm Lock to ${(getLockAwaiting(data.uuid)?.userID == interaction.user.id) ? "your" : `<@${getLockAwaiting(data.uuid)?.userID}>'s`} ${getLockAwaiting(data.uuid)?.restraintname}`);
    pagecomponents.push(maintitle)

    // Let Go Counter text
    let letcocountertitle = new TextDisplayBuilder().setContent(`### /letgo Count\nHow many times will ${(getLockAwaiting(data.uuid)?.userID == interaction.user.id) ? "you" : `<@${getLockAwaiting(data.uuid)?.userID}>`} need to successfully orgasm with **/letgo** in order to unlock the lock?`);
    pagecomponents.push(letcocountertitle)

    // Let Go Counter Actionrow
    let letgocounterar = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_decletgo`)
            .setLabel('-')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(getLockAwaiting(data.uuid).orgasmMax <= 1),

        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_num`)
            .setLabel(`${getLockAwaiting(data.uuid).orgasmMax}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true), 

        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_incletgo`)
            .setLabel('+')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(getLockAwaiting(data.uuid).orgasmMax >= 20)
        );
    pagecomponents.push(letgocounterar)

    // Ending description text
    let textaboutlock = new TextDisplayBuilder().setContent(`${this.desc}`);
    pagecomponents.push(textaboutlock)

    if (getItemName(getLockAwaiting(data.uuid)?.restraintobject) && getItemName(getLockAwaiting(data.uuid)?.restraintobject).startsWith(`Chastity Belt of Eternal`)) {
        let impossibletitle = new TextDisplayBuilder().setContent(`***Note: This lock will make it impossible to remove this restraint!***`);
        pagecomponents.push(impossibletitle)
    }

    // Buttons
    let buttons = [
        // Page Down
        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_leavebutton`)
            .setLabel("Don't Lock")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false),
        // Page Up
        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_lockbutton`)
            .setLabel("Lock")
            .setStyle(ButtonStyle.Success)
            .setDisabled(!getLockAwaiting(data.uuid)?.keyholderID),
    ]
    pagecomponents.push(new ActionRowBuilder().addComponents(...buttons));

    if (update) {
        interaction.update({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
    }
    else {
        interaction.editReply({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
    }
}

exports.lockinteractionresponse = async function(interaction) {
    let splits = interaction.customId.split("_")
    if (splits.length < 3) {
        console.error(`Something went wrong processing the interaction for a lock configuration`)
        console.error(new Error);
        console.log(interaction);
        console.log(`Expected at least 3 in splits`)
        console.log(splits);
        return;
    }
    let uuid = interaction.customId.split("_")[1] // Get the UUID!
    let command = interaction.customId.split("_")[2]

    if (command == "decletgo") {
        updateLockAwaiting(uuid, "orgasmMax", parseInt(getLockAwaiting(uuid).orgasmMax) - 1);
        this.lockinteraction(interaction, { uuid: uuid }, true);
    }
    else if (command == "incletgo") {
        updateLockAwaiting(uuid, "orgasmMax", parseInt(getLockAwaiting(uuid).orgasmMax) + 1);
        this.lockinteraction(interaction, { uuid: uuid }, true);
    }
    else if (command == "leavebutton") {
        // Delete the awaiting lock object
        removeLockAwaiting(uuid);
        // Attempt to delete the message that invoked this
        try {
            interaction.update({ components: [new TextDisplayBuilder().setContent(`This lock has been deleted.`)] })
        }
        catch (err) {
            console.log(err);
            // Can't delete for some reason, edit away all its contents
            try {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`This lock has been deleted.`)] })
            }
            catch (err2) {
                console.log(err2);
            }
        }
    }
    else if (command == "lockbutton") {
        // Engage the lock!
        try {
            let userID = getLockAwaiting(uuid).userID;
            let keyholderID = getLockAwaiting(uuid).keyholderID
            let lockrestrainttype = getItemType(getLockAwaiting(uuid).restraintobject)
            let lockrestraint = getLockAwaiting(uuid).restraintname
            let appliedlock = checkLockAwaiting(uuid);
            let targettype = (userID == interaction.user.id) ? "self" : "other"
            if (appliedlock == "NoAccess") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`You don't have access to apply a Orgasm Lock to <@${userID}>'s ${lockrestraint}.`)] })
            }
            else if (appliedlock == "NoRestraint") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`<@${userID}> is not wearing a ${lockrestraint}!`)] })
            }
            else {
                await interaction.update({ components: [new TextDisplayBuilder().setContent(`Attempting to apply lock...`)] })
                let extratext = [getLockAwaiting(uuid).orgasmMax]
                await handleApplyLock(interaction.guildId, interaction.user, await interaction.guild.members.fetch(userID), uuid).then(
                    async (success) => {
                        await interaction.followUp({ content: `Applying lock!`, flags: MessageFlags.Ephemeral })
                        applyLockAwaiting(uuid);
                        sendLockToast({ serverID: interaction.guildId, userID: userID, actionuser: interaction.user.id, actiontype: "lock", locktype: "orgasmlock", restraintname: lockrestraint, restrainttype: lockrestrainttype, targettype: targettype, extratext: extratext })
                    },
                    async (reject) => {
                        let nomessage = `<@${userID}> rejected the lock on the ${lockrestraint}.`;
                        if (reject == "Disabled") {
                            nomessage = `Item locking is currently disabled in <@${userID}>'s settings!`;
                        }
                        if (reject == "Error") {
                            nomessage = `Something went wrong - Submit a bug report!`;
                        }
                        if (reject == "NoSwap") {
                            nomessage = `<@${userID}>'s settings do not permit swapping locks on restraints! Unlock the restraint first!`;
                        }
                        if (reject == "NoDM") {
                            nomessage = `Something went wrong sending a DM to <@${userID}> , or ${getPronouns(interaction.guildId, userID, "subject")} ${getPronouns(interaction.guildId, userID, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for locking the restraint.`;
                        }
                        await interaction.followUp({ content: nomessage, flags: MessageFlags.Ephemeral });
                    },
                );
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}

exports.applyPermissionModal = function (lockawaiting) {
    let orgasmcount = lockawaiting.orgasmMax;
    let text = `💦 **Orgasms:** You will need to successfully orgasm ${orgasmcount} time${(orgasmcount != 1) ? "s" : ""} to unlock the lock.`
    if (getItemName(lockawaiting.restraintobject) && getItemName(lockawaiting.restraintobject).startsWith(`Chastity Belt of Eternal`)) {
        text = `${text}\n\n***Note: This lock will make it impossible to remove this restraint!***`
    }
    text = `${text}\n\n${getBaseLock(lockawaiting.locktype).desc}`
    return text;
}

// Display Lock Status
exports.lockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    let remainingorgasms = lock.orgasmMax - (lock.currorgasms ?? 0)
    return `${lockemoji} Locked for ${remainingorgasms} more orgasm${(remainingorgasms != 1) ? "s" : ""}`
}

// More verbose lock status info
exports.extendedLockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    let remainingorgasms = lock.orgasmMax - (lock.currorgasms ?? 0)
    return `${lockemoji} Locked for ${remainingorgasms} more orgasm${(remainingorgasms != 1) ? "s" : ""}`
}