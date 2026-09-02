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
const { getCurrentHoliday } = require("../functions/events/getCurrentHoliday");

/***********
 * This is a fixed lock that will remain inaccessible for the duration of Locktober.
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

// Only allow adding the lock DURING Locktober.
exports.canAddLock = (data) => {
    return getCurrentHoliday("Locktober");
}

// Timelock specific code
exports.checkTimelock = function (data) {
    let restraintobject = getRestraintByUUID(data.uuid).restraint
    if (!restraintobject) {
        // The timelock somehow broke, get out of here. 
        markForSave(getItemType(getRestraintByUUID(data.uuid)?.restraint))
        this.removeLock(data.uuid, { id: restraintobject.lock.keyholderID });
    }
    if (!getCurrentHoliday("Locktober")) {
        // End of the timelock!
        markForSave(getItemType(getRestraintByUUID(data.uuid)?.restraint))
        this.removeLock(data.uuid, { id: restraintobject.lock.keyholderID });
    };
}

exports.initializeLock = function(data) {
    // Initialize it by setting the person who started this as the keyholder. 
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "restraintname", getItemName(lock.restraintobject));
}

// Base Data
exports.name = "Locktober Lock"
exports.locktype = "small"
exports.desc = `A mysterious lock in the shape of a carved pumpkin. This lock automatically falls off, but becomes completely unremovable during the month of October. **Note: Nobody will not have access to this restraint until November!**`
exports.itemdescription = `### ${this.name}\n-# Type: **${this.locktype}**\n\n${this.desc}`

exports.lockinteraction = function (interaction, data, update = false) {
    let pagecomponents = [];

    // Main Title text
    let maintitle = new TextDisplayBuilder().setContent(`## Applying a Locktober Lock to ${(getLockAwaiting(data.uuid)?.userID == interaction.user.id) ? "your" : `<@${getLockAwaiting(data.uuid)?.userID}>'s`} ${getLockAwaiting(data.uuid)?.restraintname}`);
    pagecomponents.push(maintitle)

    // Ending description text
    let textaboutlock = new TextDisplayBuilder().setContent(`${this.desc}`);
    pagecomponents.push(textaboutlock)

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

    if (command == "setkeyholder") {
        let userid = interaction.values[0] ?? interaction.user.id; // Either them or us lol
        updateLockAwaiting(uuid, "keyholderID", userid);
        this.lockinteraction(interaction, { uuid: uuid }, true);
    }
    else if (command == "setpropagation") {
        // Flip the bit, if it exists. 
        updateLockAwaiting(uuid, "allowclonetoclone", !getLockAwaiting(uuid)?.allowclonetoclone);
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
                interaction.update({ components: [new TextDisplayBuilder().setContent(`You don't have access to apply a Locktober Lock to <@${userID}>'s ${lockrestraint}.`)] })
            }
            else if (appliedlock == "NoRestraint") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`<@${userID}> is not wearing a ${lockrestraint}!`)] })
            }
            else {
                await interaction.update({ components: [new TextDisplayBuilder().setContent(`Attempting to apply lock...`)] })
                await handleApplyLock(interaction.guildId, interaction.user, await interaction.guild.members.fetch(userID), uuid).then(
                    async (success) => {
                        await interaction.followUp({ content: `Applying lock!`, flags: MessageFlags.Ephemeral })
                        applyLockAwaiting(uuid);
                        if (userID == interaction.user.id) { userID = keyholderID }
                        sendLockToast({ serverID: interaction.guildId, userID: userID, actionuser: interaction.user.id, actiontype: "lock", locktype: "locktoberlock", restraintname: lockrestraint, restrainttype: lockrestrainttype, targettype: targettype })
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
    return getBaseLock(lockawaiting.locktype).desc;
}

// Display Lock Status
exports.lockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    return `${lockemoji} Locked until November!`
}

// More verbose lock status info
exports.extendedLockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    return `${lockemoji} Locked until November!`
}