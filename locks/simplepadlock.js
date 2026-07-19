const { ButtonStyle, ButtonBuilder, ActionRowBuilder, TextDisplayBuilder, MessageFlags, UserSelectMenuBuilder, SectionBuilder } = require("discord.js");
const { getRestraintByUUID } = require("../functions/getters/lock/getRestraintByUUID");
const { getLockAwaiting } = require("../functions/getters/lock/getLockAwaiting");
const { updateLockAwaiting } = require("../functions/setters/lock/updateLockAwaiting");
const { removeLockAwaiting } = require("../functions/setters/lock/removeLockAwaiting");

/***********
 * This is a basic keyed padlock for large restraints. It allows for permanent locking to a keyholder. 
 ***********/

// The condition to allow access to the item this lock is on
exports.canAccessLock = (data) => { 
    let lock = getRestraintByUUID(data.uuid).lock;
    if (lock.keyholder == data.userID) {
        return true;
    } 
    else if (lock.clonedKeyholders && lock.clonedKeyholders.includes(data.userID)) {
        return true;
    }

    return false;
}

// The condition to allow adding clonedKeyholders
exports.canCloneKeys = (data) => {
    let lock = getRestraintByUUID(data.uuid).lock;
    if (lock.keyholder == data.userID) {
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
    let lock = getRestraintByUUID(data.uuid).lock;
    if (lock.keyholder == data.userID) {
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
    let lock = getRestraintByUUID(data.uuid).lock;
    if (lock.keyholder == data.userID) {
        return true;
    } 
}

// The condition to allow removing the lock
exports.canUnlock = (data) => {
    let lock = getRestraintByUUID(data.uuid).lock;
    if (lock.keyholder == data.userID) {
        return true;
    } 
}

// Called when changing primary keyholders
exports.onTransfer = function (data) {
    this.modifyLock({ uuid: data.uuid, param: "clonedKeyholder", value: [] })
}

// Modify the keyholder
// { uuid: uuid, keyholderID: user id }
exports.modifyKeyholder = function(data) {
    this.modifyLock({ uuid: data.uuid, param: "keyholder", value: data.keyholderID })
}

// Modify the cloned keyholder
// { uuid: uuid, keyholderID: user id, add: boolean }
exports.modifyClones = function(data) {
    let lock = getRestraintByUUID(data.uuid).lock;
    let currclones = lock.clonedKeyholders;
    if (data.add && !lock.clonedKeyholders.includes(data.keyholderID)) {
        this.modifyLock({ uuid: data.uuid, param: "clonedKeyholder", value: [...currclones, data.keyholderID] })
    }
    else if (lock.clonedKeyholders.includes(data.keyholderID)) {
        currclones.splice(lock.clonedKeyholders.indexOf(data.keyholderID), 1);
        this.modifyLock({ uuid: data.uuid, param: "clonedKeyholder", value: currclones });
    }
}

exports.initializeLock = function(data) {
    // Initialize it by setting the person who started this as the keyholder. 
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "keyholder", data.keyholderID);
}

// Base Data
exports.name = "Simple Padlock"
exports.locktype = "large"
exports.desc = `A simple lock that has a key. The key can be cloned for others to have access as well. This lock will not expire until it is unlocked.`

exports.lockinteraction = function (interaction, data) {
    let pagecomponents = [];

    // Keyholder Select text
    let userselecttext = new TextDisplayBuilder().setContent(`Select a keyholder to hold your keys...`);
    pagecomponents.push(textaboutlock)

    // Keyholder Select Section
    let userselect = new UserSelectMenuBuilder()
        .setCustomId(`lockconfig_${data.uuid}_setkeyholder`)
        .setPlaceholder(`Select user...`)
        .setMaxValues(1);
    pagecomponents.push(new ActionRowBuilder().addComponents(userselect));

    // Allow Clones to Propagate Section
    let propagatesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`Allow cloned keyholders to add or remove other cloned keyholders?`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_setpropagation`)
                .setLabel(getLockAwaiting(data.uuid)?.allowclonetoclone ? "Enabled" : "Disabled")
                .setStyle(getLockAwaiting(data.uuid)?.allowclonetoclone ? ButtonStyle.Success : ButtonStyle.Danger)
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
            .setDisabled(),
        // Page Up
        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_lockbutton`)
            .setLabel("Lock")
            .setStyle(ButtonStyle.Success)
            .setDisabled(),
    ]
    pagecomponents.push(new ActionRowBuilder().addComponents(...buttons));

    interaction.editReply({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
}

exports.lockinteractionresponse = function(interaction) {
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
        updateLockAwaiting(uuid, "keyholder", userid);
        this.lockinteraction(interaction, { uuid: uuid });
    }
    else if (command == "setpropagation") {
        // Flip the bit, if it exists. 
        updateLockAwaiting(uuid, "allowclonetoclone", !getLockAwaiting(uuid)?.allowclonetoclone);
    }
    else if (command == "leavebutton") {
        // Delete the awaiting lock object
        removeLockAwaiting(uuid);
        // Attempt to delete the message that invoked this
        try {
            interaction.message.delete();
        }
        catch (err) {
            console.log(err);
            // Can't delete for some reason, edit away all its contents
            try {
                interaction.editReply({ content: `This lock has been deleted.`, components: [] })
            }
            catch (err2) {
                console.log(err2);
            }
        }
    }
    else if (command == "lockbutton") {
        // Engage the lock!

    }
}