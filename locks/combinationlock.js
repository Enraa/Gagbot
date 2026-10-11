const { ButtonStyle, ButtonBuilder, ActionRowBuilder, TextDisplayBuilder, MessageFlags, SectionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder } = require("discord.js");
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

exports.canAccessLock = (data) => { 
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    return lock?.keyholderID == data.userID;
}

exports.canCloneKeys = (data) => false;
exports.canRemoveCloneKeys = (data) => false;
exports.canTransfer = (data) => false;

exports.canUnlock = (data) => {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    return lock?.keyholderID == data.userID;
}

exports.canRevokeSelfClone = (data) => false;

exports.initializeLock = function(data) {
    let lock = getLockAwaiting(data.uuid);
    updateLockAwaiting(data.uuid, "restraintname", getItemName(lock.restraintobject));
    updateLockAwaiting(data.uuid, "keyholderID", data.keyholderID ?? lock.keyholderID ?? lock.userID);
}

exports.name = "Combination Lock"
exports.locktype = "large"
exports.desc = `A 4-digit combination padlock. The person who applies the lock sets a secret code that only they know. Only they can unlock it.`

exports.lockinteraction = function (interaction, data, update = false) {
    let pagecomponents = [];
    let awaiting = getLockAwaiting(data.uuid);

    let maintitle = new TextDisplayBuilder().setContent(
        `## Applying a Combination Lock to ${(awaiting?.userID == interaction.user.id) ? "your" : `<@${awaiting?.userID}>'s`} ${awaiting?.restraintname}`
    );
    pagecomponents.push(maintitle);

    let codestatus = awaiting?.combination 
        ? `**Code set:** \`****\` (hidden)` 
        : `**No code set yet**`;
    
    let codesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`### Combination Code\n${codestatus}\n\nOnly you will know this code.`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_setcode`)
                .setLabel(awaiting?.combination ? "Change Code" : "Set Code")
                .setStyle(ButtonStyle.Primary)
        );
    pagecomponents.push(codesection);

    pagecomponents.push(new TextDisplayBuilder().setContent(this.desc));

    let buttons = [
        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_leavebutton`)
            .setLabel("Don't Lock")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`lockconfig_${data.uuid}_lockbutton`)
            .setLabel("Lock")
            .setStyle(ButtonStyle.Success)
            .setDisabled(!awaiting?.combination),
    ];
    pagecomponents.push(new ActionRowBuilder().addComponents(...buttons));

    if (update) {
        interaction.update({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });
    } else {
        interaction.editReply({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });
    }
}

exports.lockinteractionresponse = async function(interaction) {
    let splits = interaction.customId.split("_");
    if (splits.length < 3) return;

    let uuid = splits[1];
    let command = splits[2];

    if (!process.awaitinglockinteractions) process.awaitinglockinteractions = {};
    process.awaitinglockinteractions[uuid] = interaction;

    if (command === "setcode") {
        const modal = new ModalBuilder()
            .setCustomId(`lockconfig_${uuid}_setcode`)
            .setTitle("Set 4-Digit Combination");

        const codeInput = new TextInputBuilder()
            .setCustomId("combinationcode")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("e.g. 4827")
            .setMinLength(4)
            .setMaxLength(4)
            .setRequired(true);

        const label = new LabelBuilder()
            .setLabel("4-Digit Code")
            .setDescription("Only you will know this code. It cannot be recovered later.")
            .setTextInputComponent(codeInput);

        modal.addLabelComponents(label);
        await interaction.showModal(modal);
        return;
    }

    if (command === "leavebutton") {
        removeLockAwaiting(uuid);
        try {
            await interaction.update({ components: [new TextDisplayBuilder().setContent(`This lock has been cancelled.`)] });
        } catch (e) {}
        return;
    }

    if (command === "lockbutton") {
        try {
            let awaiting = getLockAwaiting(uuid);
            let userID = awaiting.userID;
            let keyholderID = awaiting.keyholderID;
            let lockrestrainttype = getItemType(awaiting.restraintobject);
            let lockrestraint = awaiting.restraintname;
            let appliedlock = checkLockAwaiting(uuid);
            let targettype = (userID == interaction.user.id) ? "self" : "other";

            if (appliedlock === "NoAccess") {
                return interaction.update({ components: [new TextDisplayBuilder().setContent(`You don't have access to apply a Combination Lock to <@${userID}>'s ${lockrestraint}.`)] });
            }
            if (appliedlock === "NoRestraint") {
                return interaction.update({ components: [new TextDisplayBuilder().setContent(`<@${userID}> is not wearing a ${lockrestraint}!`)] });
            }

            await interaction.update({ components: [new TextDisplayBuilder().setContent(`Attempting to apply lock...`)] });

            await handleApplyLock(interaction.guildId, interaction.user, await interaction.guild.members.fetch(userID), uuid)
                .then(async () => {
                    await interaction.followUp({ content: `Applying Combination Lock!`, flags: MessageFlags.Ephemeral });
                    applyLockAwaiting(uuid);
                    sendLockToast({
                        serverID: interaction.guildId,
                        userID: userID,
                        actionuser: interaction.user.id,
                        actiontype: "lock",
                        locktype: "combinationlock",
                        restraintname: lockrestraint,
                        restrainttype: lockrestrainttype,
                        targettype: targettype
                    });
                })
                .catch(async (reject) => {
                    let msg = `<@${userID}> rejected the lock on the ${lockrestraint}.`;
                    if (reject === "Disabled") msg = `Item locking is currently disabled in <@${userID}>'s settings!`;
                    if (reject === "NoSwap") msg = `<@${userID}>'s settings do not permit swapping locks! Unlock first.`;
                    if (reject === "NoDM") msg = `Could not DM <@${userID}> for consent.`;
                    await interaction.followUp({ content: msg, flags: MessageFlags.Ephemeral });
                });
        } catch (err) {
            console.error(err);
        }
    }
}

exports.lockinteractionmodalresponse = function (interaction) {
    let uuid = interaction.customId.split("_")[1];
    interaction.deferUpdate();

    let code = interaction.fields.getTextInputValue("combinationcode")?.trim();

    if (!/^\d{4}$/.test(code)) {
        if (process.awaitinglockinteractions?.[uuid]) {
            this.lockinteraction(process.awaitinglockinteractions[uuid], { uuid }, true);
        }
        return;
    }

    updateLockAwaiting(uuid, "combination", code);

    if (process.awaitinglockinteractions?.[uuid]) {
        this.lockinteraction(process.awaitinglockinteractions[uuid], { uuid }, true);
    }
}

exports.applyPermissionModal = function (lockawaiting) {
    return `**🔒 Combination Lock**\nA secret 4-digit code has been set by the person applying this lock. Only they will know the code and be able to unlock it.\n\n${getBaseLock(lockawaiting.locktype).desc}`;
}

exports.lockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    let emoji = (lock?.keyholderID == data.userID) ? "🔑" : "🔒";
    return `${emoji} Combination Lock`;
}

exports.extendedLockStatus = function (data) {
    let lock = getRestraintByUUID(data.uuid)?.restraint?.lock;
    let emoji = (lock?.keyholderID == data.userID) ? "🔑" : "🔒";
    return `${emoji} Combination Lock (code known only to keyholder)`;
}
