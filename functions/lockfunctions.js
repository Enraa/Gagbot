const { canPlaceLock } = require("../functions/getters/lock/canPlaceLock");
const { canRemoveLock } = require("../functions/getters/lock/canRemoveLock");
const { userIsWearingItem } = require("../functions/getters/config/userIsWearingItem");
const { createLockAwaiting } = require("../functions/setters/lock/createLockAwaiting");
const { MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const { getBaseLock } = require("./getters/lock/getBaseLock");
const { getBaseItem } = require("./getters/config/getBaseItem");
const { getUserWornRestraint } = require("./getters/config/getUserWornRestraint");
const path = require("path");
const fs = require("fs");
const { getItemType } = require("./getters/config/getItemType");
const { getItemName } = require("./getters/config/getItemName");
const { removeLock } = require("./setters/lock/removeLock");
const { canAccessCollar } = require("./getters/collar/canAccessCollar");
const { getCollar } = require("./getters/collar/getCollar");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam");
const { getLockAwaiting } = require("./getters/lock/getLockAwaiting");
const { getRestraintByUUID } = require("./getters/lock/getRestraintByUUID");
const { getOption } = require("./getters/config/getOption");

// Imports each lock in ./locks and makes them accessible as objects
// in process.locktypes mapped to their respective ids.
// chastities are constructed as default -> lock, overwriting in that order.
function setUpLocks() {
    let lockfunctionsroot = path.join(__dirname, "..", "locks");
	let newlockref = require(`${lockfunctionsroot}/defaultlock.js`);
	let locktypes = fs.readdirSync(lockfunctionsroot);
	locktypes.forEach((foldertype) => {
		if (foldertype != "defaultlock.js") {
			let newlock = new newlockref.Lock(); // Instantiate a copy of the lock object.
			let specificlock = require(`${lockfunctionsroot}/${foldertype}`);
			let specificlockoverrides = Object.keys(specificlock);
			specificlockoverrides.forEach((specificover) => {
				newlock[specificover] = specificlock[specificover];
			});
			if (process.locktypes == undefined) {
				process.locktypes = {};
			}
			// Push to locktypes for reference by lock functions
			process.locktypes[foldertype.replace(".js", "")] = newlock;
            process.locktypes[foldertype.replace(".js", "")].value = foldertype.replace(".js", "");
            
			if (process.autocompletes == undefined) {
				process.autocompletes = {};
			}
			if (process.autocompletes.lock == undefined) {
				process.autocompletes.lock = [];
			}
			process.autocompletes.lock.push({ name: newlock.name, value: foldertype.replace(".js", "") });
		}
	});
}

/*****
 * I want to move these to a dedicated folder for all modal type interactions. 
 *****/

/*****
 * Provides a modal for the user based on the individual lock configuration for a restraint target. Interactions being brought into this should already have an interaction.deferReply(). 
 * 
 * - (interaction) interaction - An Interaction as piped from a /lock command
 * ---
 * ##### Returns an interaction end state
 *****/
function addLockModal(interaction) {
    let locktarget = interaction.options.getUser("wearer") ?? interaction.user;
    let itemtolock = interaction.options.getString("restraint");
    if (itemtolock == null) {
        interaction.editReply({ content: `Please select an item to lock!` })
        return;
    }
    let locktype = interaction.options.getString("locktype");
    if (itemtolock && !locktype) {
        // Try to decide the default. Simplepadlock for large, 5 minute timer for any others. If the item just can't be locked, oh well. 
        locktype = "simplepadlock";
        if (!getBaseItem(itemtolock).locktypes.includes(getBaseLock(locktype).locktype)) {
            locktype = "fiveminutelock"
        }
    }
    let baselocktype = getBaseLock(locktype);
    // If the user isn't wearing that item or it has a lock or the locker isn't allowed, tell them to leave
    if (!baselocktype) {
        interaction.editReply({ content: `Invalid lock type!`, flags: MessageFlags.Ephemeral })
        return;
    }
    if (!userIsWearingItem(interaction.guildId, locktarget.id, itemtolock)) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You aren't wearing that item!`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `${locktarget} isn't wearing that item!`, flags: MessageFlags.Ephemeral })
        }
        return;
    }
    if (!canPlaceLock(interaction.guildId, locktarget.id, interaction.user.id, locktype)) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You are unable to place a ${getBaseLock(locktype).name} on yourself.`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `You are unable to place a ${getBaseLock(locktype).name} on ${locktarget}.`, flags: MessageFlags.Ephemeral })
        }
        return;
    }

    // Check if the restraint target is the right kind for the lock we want to apply. 
    if (!getBaseItem(itemtolock).locktypes.includes(getBaseLock(locktype).locktype)) {
        interaction.editReply({ content: `That is an incorrectly sized lock for that restraint.`, flags: MessageFlags.Ephemeral })
        return;
    }

    // They can probably place the item, so generate a lock interaction and serve the modal. 
    let uuid = createLockAwaiting(interaction.guildId, locktarget.id, interaction.user.id, locktype, getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock));

    if (!uuid) {
        interaction.editReply({ content: `Something went wrong creating the lock.`, flags: MessageFlags.Ephemeral })
        return;
    }

    baselocktype.lockinteraction(interaction, { uuid: uuid })
} 

/*****
 * Handles removing a lock from a /unlock command. 
 * 
 * - (interaction) interaction - An Interaction as piped from a /lock command
 * ---
 * ##### Returns an interaction end state
 *****/
async function handleRemoveLock(interaction) {
    let locktarget = interaction.options.getUser("wearer") ?? interaction.user;
    let itemtolock = interaction.options.getString("restraint").split("|")[0];
    if (itemtolock == null) {
        await interaction.editReply({ content: `Please select an item to remove!` })
        return;
    }
    if ((interaction.options.getString("restraint").split("|").length > 1) && (interaction.options.getString("restraint").split("|")[1] == "unlockSpecial")) {
        if (getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock)) {
            if (getBaseLock(getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock).lock.locktype).unlockSpecialModal) {
                getBaseLock(getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock).lock.locktype).unlockSpecialModal({ 
                    interaction: interaction,
                    uuid: getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock).lock.uuid,
                    userID: interaction.user.id,
                }, true)
                return;
            }
        }
        else {
            await interaction.editReply({ content: `Please select an item to remove!` })
            return;
        }
    }
    await interaction.editReply({ content: `Attempting to remove lock!`, flags: MessageFlags.Ephemeral })
    let locktoremove = getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock)
    // If the user isn't wearing that item or it has a lock or the locker isn't allowed, tell them to leave
    if (!locktoremove) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You aren't wearing a ${getItemName(itemtolock)}!`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `${locktarget} isn't wearing a ${getItemName(itemtolock)}!`, flags: MessageFlags.Ephemeral })
        }
        return;
    }
    if (!locktoremove.lock) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `Your ${getItemName(itemtolock)} isn't locked!`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `${locktarget}'s ${getItemName(itemtolock)} isn't locked!`, flags: MessageFlags.Ephemeral })
        }
        return;
    }
    if (!canRemoveLock(interaction.guildId, locktarget.id, interaction.user.id, locktoremove?.lock?.uuid)) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You can't remove the ${getBaseLock(locktoremove?.lock?.locktype).name} on your ${getItemName(itemtolock)}.`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `You can't remove the ${getBaseLock(locktoremove?.lock?.locktype).name} on ${locktarget}'s ${getItemName(itemtolock)}.`, flags: MessageFlags.Ephemeral })
        }
        return;
    }

    await interaction.editReply({ content: `Removing Lock!`, flags: MessageFlags.Ephemeral })
    removeLock(locktoremove?.lock?.uuid, interaction.user);
} 

/*****
 * DMs the user, if appropriate, for permission to lock the target restraint.
 * 
 * - (server id) serverID - The server this is running on
 * - (user object) user - The user doing the action
 * - (user object) target - The user receiving the lock
 * - (string) uuid - The lock uuid to apply. 
 *****/
async function handleApplyLock(serverID, user, target, uuid) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
        // If the restraint is being SWAPPED, we need to reject if it is disabled
        if ((getOption(serverID, target.id, "swaplocks") == "disabled") && (user.id != target.id) && getRestraintByUUID(uuid)?.restraint?.lock && getBaseLock(getRestraintByUUID(uuid)?.restraint?.lock.locktype).canAccessLock({ uuid: getRestraintByUUID(uuid)?.restraint?.lock.uuid, userID: user.id })) {
            rej("NoSwap")
            return;
        }

        // User is able to access the lock of the collar and it has the appropriate permission. 
        if (getCollar(serverID, target.id) && getCollar(serverID, target.id)?.lock && getBaseLock(getCollar(serverID, target.id)?.lock.locktype).canAccessLock({ uuid: getCollar(serverID, target.id)?.lock.uuid, userID: user.id }) && getCollar(serverID, target.id).locks) {
            res(true);
            return;
        }

        // User is wearing a free use collar and it has the appropriate permission.
        if (getCollar(serverID, target.id) && !getCollar(serverID, target.id)?.keyholder_only && getCollar(serverID, target.id).locks) {
            res(true);
            return;
        }

        // Always approve ourselves. 
        if (user.id === target.id) {
            res(true);
            return
        }

		/*if (hasOption == "disabled") {
			rej("Disabled");
			return;
		} // NOPE */

        if (process.recentlypromptedlock && process.recentlypromptedlock[target.id] && process.recentlypromptedlock[target.id] > Date.now()) {
            rej("Cooldown")
            return;
        }

        let lockawaiting = getLockAwaiting(uuid)
        if (!lockawaiting.restraintobject) {
            // The restraint was unequipped, since this was passed by reference.
            rej(true);
            return;
        }
        let locktext = getBaseLock(lockawaiting.locktype).applyPermissionModal && getBaseLock(lockawaiting.locktype).applyPermissionModal(lockawaiting);
        if (!locktext) {
            console.log(`Something went wrong with the return of ${lockawaiting.locktype}'s applyPermissionModal.`)
            rej(true);
            return;
        }

		// We need to ASK
		let prompttext = `## ${user} would like to place a ${getBaseLock(lockawaiting.locktype).name} on your ${getItemName(lockawaiting.restraintobject)}\n\n${locktext}\n\nDo you wish to allow this action?`;
		let buttons = [
            new ButtonBuilder()
                .setCustomId("denyButton")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger), 
            new ButtonBuilder()
                .setCustomId("acceptButton")
                .setLabel("Allow (Wait...)")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("cooldown15")
                .setLabel("Block Requests for 15m")
                .setStyle(ButtonStyle.Danger),
            /*new ButtonBuilder()
                .setCustomId("cooldown60")
                .setLabel("Block Requests for 1h")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("cooldown1440")
                .setLabel("Block Requests for 24h")
                .setStyle(ButtonStyle.Danger)*/
        ]

        try {
            let dmchannel = await target.createDM();
            await dmchannel
                .send({ content: `${prompttext}\n-# You must wait 15 seconds for this button to activate...`, components: [new ActionRowBuilder().addComponents(...buttons)] })
                .then(async (mess) => {
                    // Create a collector for up to 5 minutes
                    const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                    collector.on("collect", async (i) => {
                        console.log(i);
                        if (i.customId == "cooldown15") {
                            if (process.recentlypromptedlock == undefined) {
                                process.recentlypromptedlock = {}
                            }
                            process.recentlypromptedlock[target.id] = Date.now() + 900000
                        }
                        if (i.customId == "cooldown60") {
                            if (process.recentlypromptedlock == undefined) {
                                process.recentlypromptedlock = {}
                            }
                            process.recentlypromptedlock[target.id] = Date.now() + 3600000
                        }
                        if (i.customId == "cooldown1440") {
                            if (process.recentlypromptedlock == undefined) {
                                process.recentlypromptedlock = {}
                            }
                            process.recentlypromptedlock[target.id] = Date.now() + 86400000
                        }
                        if (i.customId == "acceptButton") {
                            await mess.edit({ content: `Confirmed - ${getItemName(lockawaiting.restraintobject)} will be locked with a ${getBaseLock(lockawaiting.locktype).name}.`, components: [] })
                            res(true);
                        } else {
                            await mess.edit({ content: `Rejected - ${getItemName(lockawaiting.restraintobject)} will NOT be locked.`, components: [] })
                            rej(true);
                        }
                    });

                    collector.on("end", async (collected) => {
                        // timed out
                        if (collected.length == 0) {
                            await mess.edit({ content: `Timed out - ${getItemName(lockawaiting.restraintobject)} will NOT be locked.`, components: [] })
                            rej(true);
                        }
                    });

                    // Wait 15 seconds before editing the message with the new components
                    await new Promise(resolve => setTimeout(resolve, 15000));

                    let editedbuttons = [
                        new ButtonBuilder()
                            .setCustomId("denyButton")
                            .setLabel("Deny")
                            .setStyle(ButtonStyle.Danger), 
                        new ButtonBuilder()
                            .setCustomId("acceptButton")
                            .setLabel("Allow")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cooldown15")
                            .setLabel("Block Requests for 15m")
                            .setStyle(ButtonStyle.Danger),
                        /*new ButtonBuilder()
                            .setCustomId("cooldown60")
                            .setLabel("Block Requests for 1h")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("cooldown1440")
                            .setLabel("Block Requests for 24h")
                            .setStyle(ButtonStyle.Danger)*/
                    ]

                    try {
                        mess.edit({ content: prompttext, components: [new ActionRowBuilder().addComponents(...editedbuttons)] })
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
                .catch((err) => {
                    console.log(`Error sending message to lock ${user}.`);
                    console.log(err);
                    rej("NoDM");
                });
        }
        catch (err) {
            console.log(err);
            rej("NoDM")
        }
	});
}

/**********
 * Called when trying to clone a key, sends a DM to the target to verify it is okay to clone their key. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user object) user - The user performing the action
 * - (user object) target - The person whose lock we're cloning a key for
 * - (user object) clonekeyholder - The person who will receive the new key
 * - (string) uuid - The uuid of the lock
 **********/
async function promptCloneKey(serverID, user, target, clonekeyholder, uuid) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
        try {
            let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
            let dmchannel = await target.createDM();
            await dmchannel.send({ content: `${user} would like to give ${clonekeyholder} a copy of your **${getItemName(getRestraintByUUID(uuid)?.restraint)}**'s key. Do you want to allow this?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
                // Create a collector for up to 5 minutes
                const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                collector.on("collect", async (i) => {
                    console.log(i);
                    if (i.customId == "acceptButton") {
                        await mess.delete().then(() => {
                            i.reply(`Confirmed - ${clonekeyholder} will receive a copied key for your ${getItemName(getRestraintByUUID(uuid)?.restraint)}!`);
                        });
                        res(true);
                    } else {
                        await mess.delete().then(() => {
                            i.reply(`Rejected - ${clonekeyholder} will NOT receive a copied key for your ${getItemName(getRestraintByUUID(uuid)?.restraint)}!`);
                        });
                        rej(true);
                    }
                });

                collector.on("end", async (collected) => {
                    // timed out
                    if (collected.length == 0) {
                        await mess.delete().then(() => {
                            i.reply(`Timed Out - ${clonekeyholder} will NOT receive a copied key for your ${getItemName(getRestraintByUUID(uuid)?.restraint)}!`);
                        });
                        rej(true);
                    }
                });
            });
        }
		catch (err) {
            console.log(err);
        }
	});
}

/**********
 * Called when trying to transfer a key, sends a DM to the target to verify it is okay to transfer their key. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user object) user - The user performing the action
 * - (user object) target - The person whose lock we're cloning a key for
 * - (user object) newKeyholder - The person who will receive the primary key
 * - (string) uuid - The uuid of the lock
 **********/
async function promptTransferKey(serverID, user, target, newKeyholder, uuid) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
		try {
			let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
			let dmchannel = await target.createDM();
			await dmchannel.send({ content: `${user} would like to give ${newKeyholder} the keys to your **${getItemName(getRestraintByUUID(uuid)?.restraint)}**. Do you want to allow this?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
				// Create a collector for up to 5 minutes
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${newKeyholder} will receive the key for your **${getItemName(getRestraintByUUID(uuid)?.restraint)}**!`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${newKeyholder} will NOT receive the key for your **${getItemName(getRestraintByUUID(uuid)?.restraint)}**!`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed Out - ${newKeyholder} will NOT receive the key for your **${getItemName(getRestraintByUUID(uuid)?.restraint)}**!`);
						});
						rej(true);
					}
				});
			});
		} catch (err) {
			console.log(`No DMs available for ${target}`);
			rej("NoDM");
		}
	});
}

exports.setUpLocks = setUpLocks;
exports.addLockModal = addLockModal;
exports.handleRemoveLock = handleRemoveLock;
exports.handleApplyLock = handleApplyLock;
exports.promptCloneKey = promptCloneKey;
exports.promptTransferKey = promptTransferKey;