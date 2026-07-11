const { messageSendChannel } = require("./messagefunctions.js");
const { getTextGeneric } = require("./textfunctions.js");
const { removeChastity } = require("./setters/chastity/removeChastity.js");
const { removeChastityBra } = require("./setters/chastity/removeChastityBra.js");
const { getPronouns } = require("./getters/config/getPronouns.js");
const { removeCollar } = require("./setters/collar/removeCollar.js");
const { getCollarKeys } = require("./getters/collar/getCollarKeys.js");
const { getChastityKeys } = require("./getters/chastity/getChastityKeys.js");
const { getChastityBraKeys } = require("./getters/chastity/getChastityBraKeys.js");
const { getOption } = require("./getters/config/getOption.js");
const { transferCollarKey } = require("./setters/collar/transferCollarKey.js");
const { transferChastityKey } = require("./setters/chastity/transferChastityKey.js");
const { transferChastityBraKey } = require("./setters/chastity/transferChastityBraKey.js");
const { markForSave } = require("./other/markForSave.js");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam.js");
const { getChastity } = require("./getters/chastity/getChastity.js");
const { getChastityBra } = require("./getters/chastity/getChastityBra.js");
const { getCollar } = require("./getters/collar/getCollar.js");
const { getRecentChannel } = require("./getters/config/getRecentChannel.js");
const fs = require("fs");

// returns whether the locking was successful
function timelockChastity(serverID, client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
    traceFirstParam(arguments[0]);
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.chastity == undefined) process.chastity = {};
    if (process.chastity[serverID] == undefined) process.chastity[serverID] = {};
	const chastity = getChastity(serverID, wearer);
	chastity.keyholder = keyholder;
	if (!chastity) return false;
	if (chastity.keyholder == wearer) {
		chastity.keyholder = null;
		chastity.keyholderAfter = keyholderAfter ? wearer : null;
		chastity.webhookchannel = webhookchannel;
	} else chastity.keyholderAfter = [null, wearer, chastity.keyholder][keyholderAfter];
	if (access == 2) chastity.keyholder = null;
	chastity.unlockTime = unlockTime;
	chastity.access = access;
	console.log(`timelock set to unlock in ${unlockTime - now} ms`);
	/*setTimeout(() => {
		unlockTimelockChastity(serverID, client, wearer);
	}, unlockTime - now);*/
    markForSave("chastity");
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastity(serverID, client, wearer, skipWrite = false) {
    traceFirstParam(arguments[0]);
	if (process.chastity == undefined) process.chastity = {};
    if (process.chastity[serverID] == undefined) process.chastity[serverID] = {};
	const chastity = getChastity(serverID, wearer);
	if (!chastity || !chastity.unlockTime) return false;
	chastity.keyholder = chastity.keyholderAfter;
	chastity.keyholderAfter = null;
	chastity.unlockTime = null;
	chastity.access = null;
	sendTimelockChastityUnlockMessage(serverID, client, wearer, chastity.keyholder);
	if (!chastity.keyholder) removeChastity(serverID, wearer, undefined, true);
	else if (!skipWrite) {
		markForSave("chastity");
	}
	return true;
}

async function sendTimelockChastityUnlockMessage(serverID, client, wearer, keyholder) {
    traceFirstParam(arguments[0]);
	if (getRecentChannel(serverID, wearer).valid) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt unlocks and falls to the floor!`, getRecentChannel(serverID, wearer).channelid);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with ${getPronouns(serverID, wearer, "object")} holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with <@${keyholder}> holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		}
	}
    else {
        console.log(`No webhook channel found for ${wearer}.`)
    }
}

// returns whether the locking was successful
function timelockChastityBra(serverID, client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
    traceFirstParam(arguments[0]);
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.chastitybra == undefined) process.chastitybra = {};
    if (process.chastitybra[serverID] == undefined) process.chastitybra[serverID] = {};
	const chastitybra = getChastityBra(serverID, wearer)
	chastitybra.keyholder = keyholder;
	if (!chastitybra) return false;
	if (chastitybra.keyholder == wearer) {
		chastitybra.keyholder = null;
		chastitybra.keyholderAfter = keyholderAfter ? wearer : null;
		chastitybra.webhookchannel = webhookchannel;
	} else chastitybra.keyholderAfter = [null, wearer, chastitybra.keyholder][keyholderAfter];
	if (access == 2) chastitybra.keyholder = null;
	chastitybra.unlockTime = unlockTime;
	chastitybra.access = access;
	console.log(`timelock set to unlock in ${unlockTime - now} ms`);
	/*setTimeout(() => {
		unlockTimelockChastityBra(serverID, client, wearer);
	}, unlockTime - now);*/
	markForSave("chastitybra");
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastityBra(serverID, client, wearer, skipWrite = false) {
    traceFirstParam(arguments[0]);
	if (process.chastitybra == undefined) process.chastitybra = {};
    if (process.chastitybra[serverID] == undefined) process.chastitybra[serverID] = {};
	const chastitybra = getChastityBra(serverID, wearer)
	if (!chastitybra || !chastitybra.unlockTime) return false;
	chastitybra.keyholder = chastitybra.keyholderAfter;
	chastitybra.keyholderAfter = null;
	chastitybra.unlockTime = null;
	chastitybra.access = null;
	sendTimelockChastityBraUnlockMessage(serverID, client, wearer, chastitybra.keyholder);
	if (!chastitybra.keyholder) removeChastityBra(serverID, wearer, undefined, true);
	else if (!skipWrite) {
		markForSave("chastitybra");
	}
	return true;
}

async function sendTimelockChastityBraUnlockMessage(serverID, client, wearer, keyholder) {
    traceFirstParam(arguments[0]);
	if (getRecentChannel(serverID, wearer).valid) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra unlocks and falls to the floor!`, getRecentChannel(serverID, wearer).channelid);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra returns to normal with ${getPronouns(serverID, wearer, "object")} holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra returns to normal with <@${keyholder}> holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		}
	}
    else {
        console.log(`No webhook channel found for ${wearer}.`)
    }
}

// returns whether the locking was successful
function timelockCollar(serverID, client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
    traceFirstParam(arguments[0]);
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.collar == undefined) process.collar = {};
    if (process.collar[serverID] == undefined) process.collar[serverID] = {};
	const collar = getCollar(serverID, wearer);
	collar.keyholder = keyholder;
	if (!collar) return false;
	if (collar.keyholder == wearer) {
		collar.keyholder = null;
		collar.keyholderAfter = keyholderAfter ? wearer : null;
		collar.webhookchannel = webhookchannel;
	} else collar.keyholderAfter = [null, wearer, collar.keyholder][keyholderAfter];
	if (access == 2) collar.keyholder = null;
	collar.unlockTime = unlockTime;
	collar.access = access;
	console.log(`timelock set to unlock in ${unlockTime - now} ms`);
	/*setTimeout(() => {
		unlockTimelockCollar(serverID, client, wearer);
	}, unlockTime - now);*/
	markForSave("collar");
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockCollar(serverID, client, wearer, skipWrite = false) {
    traceFirstParam(arguments[0]);
	if (process.collar == undefined) process.collar = {};
    if (process.collar[serverID] == undefined) process.collar[serverID] = {};
	const collar = getCollar(serverID, wearer);
	if (!collar || !collar.unlockTime) return false;
	collar.keyholder = collar.keyholderAfter;
	collar.keyholderAfter = null;
	collar.unlockTime = null;
	collar.access = null;
	sendTimelockCollarUnlockMessage(serverID, client, wearer, collar.keyholder);
	if (!collar.keyholder) removeCollar(serverID, wearer);
	else if (!skipWrite) {
		markForSave("collar");
	}
	return true;
}

async function sendTimelockCollarUnlockMessage(serverID, client, wearer, keyholder) {
    traceFirstParam(arguments[0]);
	if (getRecentChannel(serverID, wearer).valid) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar unlocks and falls to the floor!`, getRecentChannel(serverID, wearer).channelid);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar returns to normal with ${getPronouns(serverID, wearer, "object")} holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar returns to normal with <@${keyholder}> holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		}
	}
    else {
        console.log(`No webhook channel found for ${wearer}.`)
    }
}

function checkGagbotKeys() {
    Object.keys(process.collar).forEach((server) => {
        getCollarKeys(server, process.client.user.id).forEach((k) => {
            gagbotHeldKeyTime(server, k, "collar");
        })
    })
    
    Object.keys(process.chastity).forEach((server) => {
        getChastityKeys(server, process.client.user.id).forEach((k) => {
            gagbotHeldKeyTime(server, k, "chastity");
        })
    })
    
    Object.keys(process.chastitybra).forEach((server) => {
        getChastityBraKeys(server, process.client.user.id).forEach((k) => {
            gagbotHeldKeyTime(server, k, "chastitybra");
        })
    })
    
    if (process.heldkeytimers) {
        Object.keys(process.heldkeytimers).forEach((k) => {
            gagbotHeldKeyTime(...k.split("_"));
        })
    }
}

function gagbotHeldKeyTime(serverID, wearerid, type) {
    traceFirstParam(arguments[0]);
    if (process.heldkeytimers == undefined) { process.heldkeytimers = {} }
    if (!getRecentChannel(serverID, wearerid).valid) { return }
    if (!process.heldkeytimers[`${serverID}_${wearerid}_${type}`]) {
        let data = {
            serverID: serverID,
            interactionuser: process.client.user,
            targetuser: { id: wearerid },
        }
        messageSendChannel(getTextGeneric("given_key", data), getRecentChannel(serverID, wearerid).channelid)
        let addedtime = generateTimeForGagbotKey(serverID, wearerid); // 40-100% of the time
        process.heldkeytimers[`${serverID}_${wearerid}_${type}`] = {
            releasetime: Date.now() + addedtime
        }
        markForSave("heldkeytimers");
    }
    else {
        if (process[type] && process[type][serverID] && process[type][serverID][wearerid] && process[type][serverID][wearerid].keyholder != process.client.user.id) { // Key somehow returned to the wearer, or the device was removed
            delete process.heldkeytimers[`${serverID}_${wearerid}_${type}`]
            return;
        }
        if (process.heldkeytimers[`${serverID}_${wearerid}_${type}`].releasetime < Date.now()) {
            let data = {
                serverID: serverID,
                interactionuser: process.client.user,
                targetuser: { id: wearerid },
            }
            if (process[type] && process[type][serverID] && process[type][serverID][wearerid] && process[type][serverID][wearerid].keyholder == process.client.user.id) {
                messageSendChannel(getTextGeneric(`return_key_${type}`, data), getRecentChannel(serverID, wearerid).channelid)
                if (type == "collar") { 
                    transferCollarKey(serverID, wearerid, wearerid) 
                    markForSave("collar");
                }
                if (type == "chastity") { 
                    transferChastityKey(serverID, wearerid, wearerid) 
                    markForSave("chastity");
                }
                if (type == "chastitybra") { 
                    transferChastityBraKey(serverID, wearerid, wearerid) 
                    markForSave("chastitybra");
                }
            }
            delete process.heldkeytimers[`${serverID}_${wearerid}_${type}`]
            markForSave("heldkeytimers");
        }
    }
}

/**********
 * Generates a random time for Gagbot to hold a key, based on the users gagbotholdtimer option.
 * This is a random time between 40% and 100% and shouldn't prefer the 40% like the old approach did.
 * 
 * - (server id) serverID - The server this is running on
 * - (wearer id) wearer - The user id of the person wearing the locked device
 * ---
 * ##### Return the time in milliseconds that Gagbot should hold onto the key.
 **********/
function generateTimeForGagbotKey(serverID, wearerid){
	traceFirstParam(arguments[0]);
	let maxTime = getOption(serverID, wearerid, "gagbotholdtimer");
	let randomFactor = Math.random() * 0.6 + 0.4; // Random factor between 0.4 and 1. Does not prefer 0.4 like the old approach did.
	let addedtime = Math.floor(maxTime * randomFactor);
	return addedtime;
}

exports.timelockChastity = timelockChastity;
exports.unlockTimelockChastity = unlockTimelockChastity;

exports.timelockChastityBra = timelockChastityBra;
exports.unlockTimelockChastityBra = unlockTimelockChastityBra;

exports.timelockCollar = timelockCollar;
exports.unlockTimelockCollar = unlockTimelockCollar;

exports.checkGagbotKeys = checkGagbotKeys;