const { ButtonStyle, ButtonBuilder, ActionRowBuilder, TextDisplayBuilder, MessageFlags, UserSelectMenuBuilder, SectionBuilder, ModalBuilder, TextInputBuilder, LabelBuilder, TextInputStyle } = require("discord.js");
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
const { messageSendChannel } = require("../functions/messagefunctions");
const { getRecentChannel } = require("../functions/getters/config/getRecentChannel");
const { markForSave } = require("../functions/other/markForSave");

/***********
 * This is a basic keyed padlock for large restraints. It allows for permanent locking to a keyholder. 
 ***********/

// The condition to allow access to the item this lock is on
exports.canAccessLock = (data) => { 
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock?.authenticatedusers && lock?.authenticatedusers.includes(data.userID)) {
        return true;
    } 
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
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock?.authenticatedusers && lock?.authenticatedusers.includes(data.userID)) {
        return true;
    } 
    return false;
}

// The condition for removing self from clonedKeyholders
exports.canRevokeSelfClone = (data) => { 
    return false;
};

// Called when changing primary keyholders // Not currently being used lol
exports.onTransfer = function (data) {
    return false;
}

exports.initializeLock = function(data) {
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "restraintname", getItemName(lock.restraintobject));
}

// Base Data
exports.name = "Password Lock"
exports.locktype = "large"
exports.desc = `A lock with a touch screen password entry. Once a password is set, it must be entered in order to access the lock. Once authenticated, the user is remembered until the lock is removed. `

exports.lockinteraction = function (interaction, data, update = false) {
    let pagecomponents = [];

    // Main Title text
    let maintitle = new TextDisplayBuilder().setContent(`## Applying a Password Lock to ${(getLockAwaiting(data.uuid)?.userID == interaction.user.id) ? "your" : `<@${getLockAwaiting(data.uuid)?.userID}>'s`} ${getLockAwaiting(data.uuid)?.restraintname}`);
    pagecomponents.push(maintitle)
    
    // Password Set Section
    let currtext = getLockAwaiting(data.uuid)?.lockpassword ? `Password currently set to: \`${getLockAwaiting(data.uuid)?.lockpassword}\`` : `*Password not set*`
    let propagatesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`**Enter a Password**\n-# Passwords may consist of any string between 2 and 64 characters.\n-# **Passwords are case sensitive!**\n\n${currtext}`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_setpassword`)
                .setLabel("Set Password")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
        );
    pagecomponents.push(propagatesection)

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
            .setDisabled(!getLockAwaiting(data.uuid)?.lockpassword),
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

    process.awaitinglockinteractions[uuid] = interaction

    if (command == "setpassword") {
        const modal = new ModalBuilder().setCustomId(`lockconfig_${uuid}_setpassword`).setTitle(`Configure Password Lock`)
        // Text Entry for the choice
        const timertextentrymin = new TextInputBuilder()
            .setCustomId("setpasswordstring")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("MyPrettyLockedToy!")
            .setRequired(true);

        const timertextentryminentry = new LabelBuilder().setLabel(`Enter Password`).setDescription(`Note: Passwords are Case Sensitive!`).setTextInputComponent(timertextentrymin);
        modal.addLabelComponents(timertextentryminentry);

        interaction.showModal(modal);
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
                interaction.update({ components: [new TextDisplayBuilder().setContent(`You don't have access to apply a Simple Padlock to <@${userID}>'s ${lockrestraint}.`)] })
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
                        sendLockToast({ serverID: interaction.guildId, userID: userID, actionuser: interaction.user.id, actiontype: "lock", locktype: "passwordlock", restraintname: lockrestraint, restrainttype: lockrestrainttype, targettype: targettype })
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

exports.lockinteractionmodalresponse = function (interaction) {
    let uuid = interaction.customId.split("_")[1] // We would need to get the UUID from the customId param of interaction. 
    interaction.deferUpdate();
    let passwordstring = interaction.fields.getTextInputValue("setpasswordstring") && interaction.fields.getTextInputValue("setpasswordstring").slice(0,64)
    updateLockAwaiting(uuid, "lockpassword", undefined);
    if (passwordstring && (passwordstring.length > 1)) {
        updateLockAwaiting(uuid, "lockpassword", passwordstring); 
    }
    if (process.awaitinglockinteractions[uuid]) {
        this.lockinteraction(process.awaitinglockinteractions[uuid], { uuid: uuid });
    }
}

/******
 * data has the following structure:
 * { uuid, interaction, userID }
 ******/
exports.unlockSpecialModal = function (data, update = false) {
    if (data.success) {
        data.interaction.editReply({ components: [new TextDisplayBuilder().setContent(`Password accepted! You now have access to this restraint!`)], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })
        return;
    }

    let pagecomponents = [];

    // Main Title text
    let maintitle = new TextDisplayBuilder().setContent(`## Attempting to unlock Password Lock on ${(getRestraintByUUID(data.uuid)?.userID == data.interaction.user.id) ? "your" : `<@${getRestraintByUUID(data.uuid)?.userID}>'s`} ${getItemName(getRestraintByUUID(data.uuid)?.restraint)}`);
    pagecomponents.push(maintitle)
    
    // Password Set Section`
    let failuretext = (data.failure ? `***Invalid Password***` : ``)
    let propagatesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`**Enter a Password**\nThe lock is currently engaged and requires you to enter a password to proceed.\n\n${failuretext}`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockspecial_${data.uuid}_trypassword`)
                .setLabel("Enter Password")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
        );
    pagecomponents.push(propagatesection)

    /*if (update) {
        data.interaction.update({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
    }
    else {*/
        data.interaction.editReply({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
    //}
}

exports.unlockSpecialresponse = async function(interaction) {
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

    process.awaitinglockinteractions[`${uuid}_${interaction.user.id}`] = interaction

    if (command == "trypassword") {
        const modal = new ModalBuilder().setCustomId(`lockspecial_${uuid}_trypassword`).setTitle(`Password Entry`)
        // Text Entry for the choice
        const timertextentrymin = new TextInputBuilder()
            .setCustomId("enterpasswordstring")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("MyPrettyLockedToy?")
            .setRequired(true);

        const timertextentryminentry = new LabelBuilder().setLabel(`Enter Password`).setDescription(`Note: Passwords are Case Sensitive!`).setTextInputComponent(timertextentrymin);
        modal.addLabelComponents(timertextentryminentry);

        interaction.showModal(modal);
    }
}

exports.unlockSpecialmodalresponse = function (interaction) {
    let uuid = interaction.customId.split("_")[1] // We would need to get the UUID from the customId param of interaction. 
    interaction.deferUpdate();
    let success;
    let failure;
    let passwordstring = interaction.fields.getTextInputValue("enterpasswordstring") && interaction.fields.getTextInputValue("enterpasswordstring").slice(0,64)
    if (passwordstring && passwordstring.length > 1 && (getRestraintByUUID(uuid).restraint.lock.lockpassword == passwordstring)) {
        let lock = getRestraintByUUID(uuid).restraint.lock;
        let currusers = lock.authenticatedusers ?? [];
        currusers.push(interaction.user.id)
        lock.authenticatedusers = currusers; 
        success = true;
        messageSendChannel(`<@${interaction.user.id}> types in a code and the screen on ${(lock.userID == interaction.user.id) ? getPronouns(lock.serverID, lock.userID, "possessiveDeterminer") : `<@${lock.userID}>'s`} ${getItemName(getRestraintByUUID(uuid).restraint)} turns green!`, getRecentChannel(lock.serverID, lock.userID).channelid)
        markForSave(getItemType(getRestraintByUUID(uuid).restraint));
    }
    else {
        failure = true;
    }
    if (process.awaitinglockinteractions[`${uuid}_${interaction.user.id}`]) {
        this.unlockSpecialModal({
            uuid: uuid,
            interaction: process.awaitinglockinteractions[`${uuid}_${interaction.user.id}`],
            userID: interaction.user.id,
            success: success,
            failure: failure
        }, true);
    }
}

exports.unlockSpecialType = "Password"

exports.applyPermissionModal = function (lockawaiting) {
    let text = `🔤 **Password:** Your restraint will be locked with a password. This password can be supplied by you or anyone to gain access to it. It cannot be unlocked without the password.`
    text = `${text}\n\n${getBaseLock(lockawaiting.locktype).desc}`
    return text;
}

// Display Lock Status
exports.lockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    if (lock.authenticatedusers && (lock.authenticatedusers.includes(data.userID))) {
        lockemoji = "🔑"
    }
    return `${lockemoji} Locked with a password`
}

// More verbose lock status info
exports.extendedLockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    if (lock.authenticatedusers && (lock.authenticatedusers.includes(data.userID))) {
        lockemoji = "🔑"
    }
    return `${lockemoji} Locked with a password`
}