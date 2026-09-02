const { ButtonStyle, ButtonBuilder, ActionRowBuilder, TextDisplayBuilder, MessageFlags, UserSelectMenuBuilder, SectionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder } = require("discord.js");
const { getRestraintByUUID } = require("../functions/getters/lock/getRestraintByUUID");
const { getLockAwaiting } = require("../functions/getters/lock/getLockAwaiting");
const { updateLockAwaiting } = require("../functions/setters/lock/updateLockAwaiting");
const { removeLockAwaiting } = require("../functions/setters/lock/removeLockAwaiting");
const { applyLockAwaiting } = require("../functions/setters/lock/applyLockAwaiting");
const { getPronouns } = require("../functions/getters/config/getPronouns");
const { getItemName } = require("../functions/getters/config/getItemName");
const { sendLockToast } = require("../functions/setters/lock/sendLockToast");
const { getItemType } = require("../functions/getters/config/getItemType");
const { parseTime, parseMS, parseDuration } = require("../functions/timefunctions");
const { handleApplyLock } = require("../functions/lockfunctions");
const { checkLockAwaiting } = require("../functions/getters/lock/checkLockAwaiting");
const { getBaseLock } = require("../functions/getters/lock/getBaseLock");

/***********
 * This is a fixed timelock that only operates for five minutes and then removes itself. It can be affixed to small locks.
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

// Timelock specific code
exports.checkTimelock = function (data) {
    let restraintobject = getRestraintByUUID(data.uuid).restraint
    if (!restraintobject || (typeof restraintobject.timelock != "number")) {
        // The timelock somehow broke, get out of here. 
        markForSave(getItemType(getRestraintByUUID(data.uuid)?.restraint))
        this.removeLock(data.uuid, { id: restraintobject.lock.keyholderID });
    }
    if (Date.now() > restraintobject.timelock) {
        // End of the timelock!
        markForSave(getItemType(getRestraintByUUID(data.uuid)?.restraint))
        this.removeLock(data.uuid, { id: restraintobject.lock.keyholderID });
    };
}

exports.initializeLock = function(data) {
    // Initialize it by setting the person who started this as the keyholder. 
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "restraintname", getItemName(lock.restraintobject));
    updateLockAwaiting(data.uuid, "headpattime", 0);
}

// Base Data
exports.name = "Headpat Timer Lock"
exports.locktype = "large"
exports.desc = `A configurable timer that will not unlock until the timer expires. Can be configured to a minimum and maximum time, as well as to hide the display. When the wearer receives a headpat, the timer will be extended.`
exports.itemdescription = `### ${this.name}\n-# Type: **${this.locktype}**\n\n${this.desc}`

exports.lockinteraction = function (interaction, data, update = false) {
    let pagecomponents = [];

    // Main Title text
    let maintitle = new TextDisplayBuilder().setContent(`## Applying a Headpat Timer Lock to ${(getLockAwaiting(data.uuid)?.userID == interaction.user.id) ? "your" : `<@${getLockAwaiting(data.uuid)?.userID}>'s`} ${getLockAwaiting(data.uuid)?.restraintname}`);
    pagecomponents.push(maintitle)

    // Timer configuration
    let timertexttitle = `### Timer Configuration`
    let timertimeinfo = (getLockAwaiting(data.uuid)?.minTime ? (getLockAwaiting(data.uuid)?.maxTime ? `Will unlock between <t:${Math.floor((getLockAwaiting(data.uuid)?.minTime) / 1000)}:f> and <t:${Math.floor((getLockAwaiting(data.uuid)?.maxTime) / 1000)}:f>` : `Will unlock at <t:${Math.floor((getLockAwaiting(data.uuid)?.minTime) / 1000)}:f>`) : `*Timer not configured*`)
    let timerconfigsection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`${timertexttitle}\n\n${timertimeinfo}`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_settimer`)
                .setLabel("Set Time")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
        );
    pagecomponents.push(timerconfigsection)

    // Timer configuration
    let timerhidesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`### Hide Timer While Active\n\nShould the timer be hidden while locked?`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_hidetimer`)
                .setLabel(getLockAwaiting(data.uuid)?.hidetimer ? "Enabled" : "Disabled")
                .setStyle(getLockAwaiting(data.uuid)?.hidetimer ? ButtonStyle.Success : ButtonStyle.Danger)
                .setDisabled(false)
        );
    pagecomponents.push(timerhidesection)

    // Headpat time extension
    let headpattexttitle = `### Time Added when Headpatted`
    let headpattimeinfo = (`When receiving a headpat, the timer will be extended by ${parseDuration(getLockAwaiting(data.uuid)?.headpattime)}`)
    let headpatconfigsection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`${headpattexttitle}\n\n${headpattimeinfo}`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_setheadpattime`)
                .setLabel("Set Headpat Time")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
        );
    pagecomponents.push(headpatconfigsection)

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

    process.awaitinglockinteractions[uuid] = interaction

    if (command == "settimer") {
        const modal = new ModalBuilder().setCustomId(`lockconfig_${uuid}_settimer`).setTitle(`Configure Timer`)
        // Text Entry for the choice
        const timertextentrymin = new TextInputBuilder()
            .setCustomId("choiceinputmin")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("1h20m")
            .setRequired(true);

        const timertextentryminentry = new LabelBuilder().setLabel(`Minimum Time Bound`).setDescription(`Enter a string such as __h__m to be bound for:`).setTextInputComponent(timertextentrymin);
        modal.addLabelComponents(timertextentryminentry);
        // Text Entry for the choice
        const timertextentrymax = new TextInputBuilder()
            .setCustomId("choiceinputmax")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("(Optional) 5h48m")
            .setRequired(false);

        const timertextentrymaxentry = new LabelBuilder().setLabel(`Maximum Time Bound`).setDescription(`(Optional) If specified, will choose range:`).setTextInputComponent(timertextentrymax);
        modal.addLabelComponents(timertextentrymaxentry);
        interaction.showModal(modal);
    }
    else if (command == "setheadpattime") {
        const modal = new ModalBuilder().setCustomId(`lockconfig_${uuid}_setheadpattime`).setTitle(`Configure Added Time`)
        // Text Entry for the choice
        const timertextentrymin = new TextInputBuilder()
            .setCustomId("choiceinputmin")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("1h20m")
            .setRequired(true);

        const timertextentryminentry = new LabelBuilder().setLabel(`Time Added on Headpat`).setDescription(`Enter a string such as __h__m to extend by:`).setTextInputComponent(timertextentrymin);
        modal.addLabelComponents(timertextentryminentry);
        interaction.showModal(modal);
    }
    else if (command == "hidetimer") {
        // Flip the bit, if it exists. 
        updateLockAwaiting(uuid, "hidetimer", !getLockAwaiting(uuid)?.hidetimer);
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
            let hiddentimer = getLockAwaiting(uuid).hidetimer
            let locktime = Date.now();
            if (getLockAwaiting(uuid).maxTime) {
                updateLockAwaiting(uuid, "unlocktime", (getLockAwaiting(uuid).minTime + Math.floor((getLockAwaiting(uuid).maxTime - getLockAwaiting(uuid).minTime) * Math.random())));
            }
            else {
                updateLockAwaiting(uuid, "unlocktime", getLockAwaiting(uuid).minTime);
            }
            locktime = getLockAwaiting(uuid).unlocktime
            let appliedlock = checkLockAwaiting(uuid);
            let targettype = (userID == interaction.user.id) ? "self" : "other"
            if (appliedlock == "NoAccess") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`You don't have access to apply a Headpat Timer Lock to <@${userID}>'s ${lockrestraint}.`)] })
            }
            else if (appliedlock == "NoRestraint") {
                interaction.update({ components: [new TextDisplayBuilder().setContent(`<@${userID}> is not wearing a ${lockrestraint}!`)] })
            }
            else {
                await interaction.update({ components: [new TextDisplayBuilder().setContent(`Attempting to apply lock...`)] })
                let extratext = [hiddentimer ? `for an unknown amount of time` : `until <t:${Math.floor(locktime / 1000)}:f>`]
                await handleApplyLock(interaction.guildId, interaction.user, await interaction.guild.members.fetch(userID), uuid).then(
                    async (success) => {
                        await interaction.followUp({ content: `Applying lock!`, flags: MessageFlags.Ephemeral })
                        applyLockAwaiting(uuid);
                        if (userID == interaction.user.id) { userID = keyholderID }
                        sendLockToast({ serverID: interaction.guildId, userID: userID, actionuser: interaction.user.id, actiontype: "lock", locktype: "headpatlock", restraintname: lockrestraint, restrainttype: lockrestrainttype, targettype: targettype, extratext: extratext })
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
    if (interaction.customId.split("_")[2] && (interaction.customId.split("_")[2] == "settimer")) {
        interaction.deferUpdate();
        let mintime = interaction.fields.getTextInputValue("choiceinputmin") && interaction.fields.getTextInputValue("choiceinputmin").slice(0,30)
        let maxtime = interaction.fields.getTextInputValue("choiceinputmax") && interaction.fields.getTextInputValue("choiceinputmax").slice(0,30)
        updateLockAwaiting(uuid, "minTime", undefined);
        if (mintime) {
            updateLockAwaiting(uuid, "minTime", parseTime(mintime).valueOf());
            updateLockAwaiting(uuid, "maxTime", undefined); // Clear max time in case max time wasn't specified
        }
        if (maxtime) {
            updateLockAwaiting(uuid, "maxTime", parseTime(maxtime).valueOf());
        }

        if (process.awaitinglockinteractions[uuid]) {
            this.lockinteraction(process.awaitinglockinteractions[uuid], { uuid: uuid });
        }
    }
    else if (interaction.customId.split("_")[2] && (interaction.customId.split("_")[2] == "setheadpattime")) {
        interaction.deferUpdate();
        let mintime = interaction.fields.getTextInputValue("choiceinputmin") && interaction.fields.getTextInputValue("choiceinputmin").slice(0,30)
        updateLockAwaiting(uuid, "headpattime", 0);
        if (mintime) {
            updateLockAwaiting(uuid, "headpattime", parseMS(mintime));
        }

        if (process.awaitinglockinteractions[uuid]) {
            this.lockinteraction(process.awaitinglockinteractions[uuid], { uuid: uuid });
        }
    }
}

exports.applyPermissionModal = function (lockawaiting) {
    let trange = lockawaiting?.maxTime ? `until sometime between <t:${Math.floor(lockawaiting?.minTime / 1000)}:f> and <t:${Math.floor(lockawaiting?.maxTime / 1000)}:f>` : `until <t:${Math.floor(lockawaiting?.unlocktime / 1000)}:f>`
    let text = `⏱️ **Timer:** Your lock will be locked ${lockawaiting.hidetimer ? `for an unknown amount of time.` : trange}.`
    if (lockawaiting.hidetimer) {
        text = `${text}\n🤝 **Hidden:** The timer will not be displayed to you or anyone.`
    }
    text = `${text}\n\n${getBaseLock(lockawaiting.locktype).desc}`
    return text;
}

// Display Lock Status
exports.lockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = lock.hidetimer ? "❓" : "🔒"
    let locktext = lock.hidetimer ? "Locked for an unknown time..." : `Locked until <t:${Math.floor(lock?.unlocktime / 1000)}:f>`
    return `${lockemoji} ${locktext}`
}

// More verbose lock status info
exports.extendedLockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock
    let lockemoji = lock.hidetimer ? "❓" : "🔒"
    let locktext = lock.hidetimer ? "Locked for an unknown time..." : `Locked until <t:${Math.floor(lock?.unlocktime / 1000)}:f>`
    return `${lockemoji} ${locktext}`
}