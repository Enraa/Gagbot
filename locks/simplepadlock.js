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
 * This is a basic keyed padlock for large restraints. It allows for permanent locking to a keyholder. 
 ***********/

// The condition to allow access to the item this lock is on
exports.canAccessLock = (data) => { 
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock?.keyholderID == data.userID) {
        return true;
    } 
    else if (lock?.clonedKeyholders && lock?.clonedKeyholders?.includes(data.userID)) {
        return true;
    }

    return false;
}

// The condition to allow adding clonedKeyholders
exports.canCloneKeys = (data) => {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock.keyholderID == data.userID) {
        return true;
    } 
    // If permitted by the lock configuration at the beginning, allow a clone to propagate.
    else if (lock.allowclonetoclone && lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        return true;
    }

    return false;
}

// The condition to allow removing clonedKeyholders
exports.canRemoveCloneKeys = (data) => {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock.keyholderID == data.userID) {
        return true;
    } 
    // If permitted by the lock configuration at the beginning, allow a clone to propagate.
    else if (lock.allowclonetoclone && lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        return true;
    }

    return false;
}

// The condition to allow transferring primary keyholder
exports.canTransfer = (data) => {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock.keyholderID == data.userID) {
        return true;
    } 
}

// The condition to allow removing the lock
exports.canUnlock = (data) => {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock.keyholderID == data.userID) {
        return true;
    } 
    if (lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        return true;
    } 
}

// The condition for removing self from clonedKeyholders
exports.canRevokeSelfClone = (data) => { 
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    if (lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        return true;
    } 
};

// Called when changing primary keyholders // Not currently being used lol
exports.onTransfer = function (data) {
    this.modifyLock({ uuid: data.uuid, param: "clonedKeyholders", value: [] })
}

// Modify the keyholder
// { uuid: uuid, keyholderID: user id }
exports.modifyKeyholder = function(data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    this.modifyLock({ uuid: data.uuid, param: "keyholderID", value: data.userID })
    if (!lock.preserveclone) {
        this.modifyLock({ uuid: data.uuid, param: "clonedKeyholders", value: [] })
    }
    if (lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        let currclones = lock.clonedKeyholders;
        currclones.splice(lock.clonedKeyholders.indexOf(data.userID), 1);
        this.modifyLock({ uuid: data.uuid, param: "clonedKeyholders", value: currclones });
    }
}

// Modify the cloned keyholder
// { uuid: uuid, keyholderID: user id, add: boolean }
exports.modifyClones = function(data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    let currclones = lock.clonedKeyholders ?? [];
    if (data.add && !currclones.includes(data.userID)) {
        this.modifyLock({ uuid: data.uuid, param: "clonedKeyholders", value: [...currclones, data.userID] })
    }
    else if (lock?.clonedKeyholders?.includes(data.userID)) {
        currclones.splice(lock?.clonedKeyholders?.indexOf(data.userID), 1);
        this.modifyLock({ uuid: data.uuid, param: "clonedKeyholders", value: currclones });
    }
}

exports.initializeLock = function(data) {
    // Initialize it by setting the person who started this as the keyholder. 
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "keyholderID", data.keyholderID);
    updateLockAwaiting(data.uuid, "restraintname", getItemName(lock.restraintobject));
}

// Base Data
exports.name = "Simple Padlock"
exports.locktype = "large"
exports.desc = `A simple lock that has a key. The key can be cloned for others to have access as well. This lock will not expire until it is unlocked.`
exports.itemdescription = `### ${this.name}\n-# Type: **${this.locktype}**\n\n${this.desc}`

exports.lockinteraction = function (interaction, data, update = false) {
    let pagecomponents = [];

    // Main Title text
    let maintitle = new TextDisplayBuilder().setContent(`## Applying a Simple Padlock to ${(getLockAwaiting(data.uuid)?.userID == interaction.user.id) ? "your" : `<@${getLockAwaiting(data.uuid)?.userID}>'s`} ${getLockAwaiting(data.uuid)?.restraintname}`);
    pagecomponents.push(maintitle)

    // Keyholder Select text
    let userselecttext = new TextDisplayBuilder().setContent(`**Select a keyholder to hold your keys...**`);
    pagecomponents.push(userselecttext)

    // Keyholder Select Section
    let userselect = new UserSelectMenuBuilder()
        .setCustomId(`lockconfig_${data.uuid}_setkeyholder`)
        .setPlaceholder(`Select user...`)
        .setMaxValues(1);
    pagecomponents.push(new ActionRowBuilder().addComponents(userselect));

    // Keyholder Select text
    if (getLockAwaiting(data.uuid)?.keyholderID) {
        let holdtext = ``;
        //let itemtext = `**${getLockAwaiting(data.uuid)?.restraintobject}**` // We need *another* function to feed a restraint object and get the display name of it. 
        if (getLockAwaiting(data.uuid)?.keyholderID == getLockAwaiting(data.uuid)?.userID) {
            // Holding self keys
            if (interaction.user.id == getLockAwaiting(data.uuid)?.userID) {
                // This is ourself!
                holdtext = `*You will be holding your own key!*`
            }
            else {
                // This is someone else!
                holdtext = `*<@${getLockAwaiting(data.uuid)?.userID}> will be holding ${getPronouns(getLockAwaiting(data.uuid)?.serverID, getLockAwaiting(data.uuid)?.userID, "possessiveDeterminer")} key!*`
            }
        }
        else {
            // Someone else is holding the key
            if (interaction.user.id == getLockAwaiting(data.uuid)?.userID) {
                // This is ourself!
                holdtext = `*<@${getLockAwaiting(data.uuid)?.keyholderID}> will be holding your key!*`
            }
            else {
                // This is someone else
                if (interaction.user.id == getLockAwaiting(data.uuid)?.keyholderID) {
                    // We're holding someone else's key
                    holdtext = `*You will be holding <@${getLockAwaiting(data.uuid)?.userID}>'s key!*`
                }
                else {
                    // Someone else will be holding their key
                    holdtext = `*<@${getLockAwaiting(data.uuid)?.keyholderID}> will be holding <@${getLockAwaiting(data.uuid)?.userID}>'s key!*`
                }
            }
        }
        let userkeytext = new TextDisplayBuilder().setContent(`-# ${holdtext}`);
        pagecomponents.push(userkeytext)
    }
    else {
        let userkeytext = new TextDisplayBuilder().setContent(`-# *No keyholder currently selected!*`);
        pagecomponents.push(userkeytext)
    }
    
    // Allow Clones to Propagate Section
    let propagatesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`**Allow cloned keyholders to add or remove other cloned keyholders?**`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_setpropagation`)
                .setLabel(getLockAwaiting(data.uuid)?.allowclonetoclone ? "Enabled" : "Disabled")
                .setStyle(getLockAwaiting(data.uuid)?.allowclonetoclone ? ButtonStyle.Success : ButtonStyle.Danger)
                .setDisabled(false)
        );
    pagecomponents.push(propagatesection)

    // Preserve Clones when transferring
    let preservesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`**Preserve cloned keyholders when transferring primary keys?**`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_preserveclone`)
                .setLabel(getLockAwaiting(data.uuid)?.preserveclone ? "Enabled" : "Disabled")
                .setStyle(getLockAwaiting(data.uuid)?.preserveclone ? ButtonStyle.Success : ButtonStyle.Danger)
                .setDisabled(false)
        );
    pagecomponents.push(preservesection)

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
    else if (command == "preserveclone") {
        // Flip the bit, if it exists. 
        updateLockAwaiting(uuid, "preserveclone", !getLockAwaiting(uuid)?.preserveclone);
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
            let further = [(keyholderID == interaction.user.id) ? "selflock" : (keyholderID == userID) ? "otherselflock" : "otherlock"]
            let extratext = (further[0] == "other") ? [keyholderID] : undefined;
            if (appliedlock == "NoAccess") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`You don't have access to apply a Simple Padlock to <@${userID}>'s ${lockrestraint}.`)] })
            }
            else if (appliedlock == "NoRestraint") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`<@${userID}> is not wearing a ${lockrestraint}!`)] })
            }
            else {
                await interaction.update({ components: [new TextDisplayBuilder().setContent(`Attempting to apply lock...`)] })
                let extratext = [keyholderID]
                await handleApplyLock(interaction.guildId, interaction.user, await interaction.guild.members.fetch(userID), uuid).then(
                    async (success) => {
                        await interaction.followUp({ content: `Applying lock!`, flags: MessageFlags.Ephemeral })
                        applyLockAwaiting(uuid);
                        if (userID == interaction.user.id) { userID = keyholderID }
                        sendLockToast({ serverID: interaction.guildId, userID: userID, actionuser: interaction.user.id, actiontype: "lock", locktype: "simplepadlock", restraintname: lockrestraint, restrainttype: lockrestrainttype, targettype: targettype, extratext: extratext, further: further })
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
    let text = `🔑 **Keyholder:** Your **keyholder** will be <@${lockawaiting.keyholderID}>. Only ${getPronouns(lockawaiting.serverID, lockawaiting.keyholderID, "subject")} will be able to unlock your restraint.`
    if (lockawaiting.allowclonetoclone) {
        text = `${text}\n🤝 **Propagation:** If your **primary key** is cloned, cloned keyholders will be allowed to attempt to make additional clones.`
    }
    if (lockawaiting.preserveclone) {
        text = `${text}\n💾 **Preserve:** If your **primary key** is transferred, cloned keys will not be destroyed on transfer.`
    }
    text = `${text}\n\n${getBaseLock(lockawaiting.locktype).desc}`
    return text;
}

// Display Lock Status
exports.lockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    if ((lock.keyholderID == data.userID)) {
        lockemoji = "🔑"
    }
    else if (lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        lockemoji = process.emojis.keyclone
    }
    return `${lockemoji} Locked by <@${lock.keyholderID}>`
}

// More verbose lock status info
exports.extendedLockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = "🔒"
    if (lock.keyholderID == data.userID) {
        lockemoji = "🔑"
    }
    else if (lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        lockemoji = process.emojis.keyclone
    }
    let textreturn = `${lockemoji} Locked by <@${lock.keyholderID}>`
    if (lock.clonedKeyholders && (lock.clonedKeyholders.length > 0)) {
        textreturn = `${textreturn}, Cloned Keys held by `
        for (let i = 0; i < lock.clonedKeyholders.length; i++) {
            if (i != 0) {
                textreturn = `${textreturn}, <@${lock.clonedKeyholders[i]}>`
            }
            else {
                textreturn = `${textreturn}<@${lock.clonedKeyholders[i]}>`
            }
        }
    }
    return textreturn;
}