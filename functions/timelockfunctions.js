const { removeChastity, removeChastityBra, getChastityKeys, transferChastityKey } = require("./vibefunctions");
const { removeCollar, getCollarKeys, transferCollarKey } = require("./collarfunctions.js");
const { getPronouns } = require("./pronounfunctions.js");
const { messageSendChannel } = require("./messagefunctions.js");
const fs = require("fs");
const { getTextGeneric } = require("./textfunctions.js");
const { getChastityBraKeys } = require("./vibefunctions.js");
const { transferChastityBraKey } = require("./vibefunctions.js");

// returns whether the locking was successful
function timelockChastity(client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.chastity == undefined) process.chastity = {};
	const chastity = process.chastity[wearer];
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
	setTimeout(() => {
		unlockTimelockChastity(client, wearer);
	}, unlockTime - now);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastity(client, wearer, skipWrite = false) {
	if (process.chastity == undefined) process.chastity = {};
	const chastity = process.chastity[wearer];
	if (!chastity || !chastity.unlockTime) return false;
	chastity.keyholder = chastity.keyholderAfter;
	chastity.keyholderAfter = null;
	chastity.unlockTime = null;
	chastity.access = null;
	sendTimelockChastityUnlockMessage(client, wearer, chastity.keyholder);
	if (!chastity.keyholder) removeChastity(wearer, undefined, true);
	else if (!skipWrite) {
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.chastity = true;
	}
	return true;
}

async function sendTimelockChastityUnlockMessage(client, wearer, keyholder) {
	if (process.chastity[wearer]?.webhookchannel) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt unlocks and falls to the floor!`, process.chastity[wearer].webhookchannel);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with ${getPronouns(wearer, "object")} holding the keys!`, process.chastity[wearer].webhookchannel);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with <@${keyholder}> holding the keys!`, process.chastity[wearer].webhookchannel);
		}
	}
}

// returns whether the locking was successful
function timelockChastityBra(client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.chastitybra == undefined) process.chastitybra = {};
	const chastitybra = process.chastitybra[wearer];
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
	setTimeout(() => {
		unlockTimelockChastity(client, wearer);
	}, unlockTime - now);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastityBra(client, wearer, skipWrite = false) {
	if (process.chastitybra == undefined) process.chastitybra = {};
	const chastitybra = process.chastitybra[wearer];
	if (!chastitybra || !chastitybra.unlockTime) return false;
	chastitybra.keyholder = chastitybra.keyholderAfter;
	chastitybra.keyholderAfter = null;
	chastitybra.unlockTime = null;
	chastitybra.access = null;
	sendTimelockChastityBraUnlockMessage(client, wearer, chastitybra.keyholder);
	if (!chastitybra.keyholder) removeChastityBra(wearer, undefined, true);
	else if (!skipWrite) {
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.chastitybra = true;
	}
	return true;
}

async function sendTimelockChastityBraUnlockMessage(client, wearer, keyholder) {
	if (process.chastitybra[wearer]?.webhookchannel) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra unlocks and falls to the floor!`, process.chastitybra[wearer]?.webhookchannel);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra returns to normal with ${getPronouns(wearer, "object")} holding the keys!`, process.chastitybra[wearer]?.webhookchannel);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra returns to normal with <@${keyholder}> holding the keys!`, process.chastitybra[wearer]?.webhookchannel);
		}
	}
}

// returns whether the locking was successful
function timelockCollar(client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.collar == undefined) process.collar = {};
	const collar = process.collar[wearer];
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
	setTimeout(() => {
		unlockTimelockChastity(client, wearer);
	}, unlockTime - now);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockCollar(client, wearer, skipWrite = false) {
	if (process.collar == undefined) process.collar = {};
	const collar = process.collar[wearer];
	if (!collar || !collar.unlockTime) return false;
	collar.keyholder = collar.keyholderAfter;
	collar.keyholderAfter = null;
	collar.unlockTime = null;
	collar.access = null;
	sendTimelockCollarUnlockMessage(client, wearer, collar.keyholder);
	if (!collar.keyholder) removeCollar(wearer);
	else if (!skipWrite) {
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.collar = true;
	}
	return true;
}

async function sendTimelockCollarUnlockMessage(client, wearer, keyholder) {
	if (process.collar[wearer]?.webhookchannel) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar unlocks and falls to the floor!`, process.collar[wearer]?.webhookchannel);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar returns to normal with ${getPronouns(wearer, "object")} holding the keys!`, process.collar[wearer]?.webhookchannel);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar returns to normal with <@${keyholder}> holding the keys!`, process.collar[wearer]?.webhookchannel);
		}
	}
}

function checkGagbotKeys() {
    getCollarKeys(process.client.user.id).forEach((k) => {
        gagbotHeldKeyTime(k, "collar");
    })
    getChastityKeys(process.client.user.id).forEach((k) => {
        gagbotHeldKeyTime(k, "chastity");
    })
    getChastityBraKeys(process.client.user.id).forEach((k) => {
        gagbotHeldKeyTime(k, "chastitybra");
    })
    if (process.heldkeytimers) {
        Object.keys(process.heldkeytimers).forEach((k) => {
            gagbotHeldKeyTime(...k.split("_"));
        })
    }
}

function gagbotHeldKeyTime(wearerid, type) {
    if (process.heldkeytimers == undefined) { process.heldkeytimers = {} }
    if (!process.recentmessages[wearerid]) { return }
    if (!process.heldkeytimers[`${wearerid}_${type}`]) {
        let data = {
            interactionuser: process.client.user,
            targetuser: { id: wearerid },
        }
        messageSendChannel(getTextGeneric("given_key", data), process.recentmessages[wearerid])
        process.heldkeytimers[`${wearerid}_${type}`] = {
            releasetime: Date.now() + (Math.floor(Math.random() * 480000)) + 120000 // 2-10 minutes
        }
    }
    else {
        if (process[type] && process[type][wearerid] && process[type][wearerid].keyholder != process.client.user.id) { // Key somehow returned to the wearer, or the device was removed
            delete process.heldkeytimers[`${wearerid}_${type}`]
            return;
        }
        if (process.heldkeytimers[`${wearerid}_${type}`].releasetime < Date.now()) {
            let data = {
                interactionuser: process.client.user,
                targetuser: { id: wearerid },
            }
            messageSendChannel(getTextGeneric(`return_key_${type}`, data), process.recentmessages[wearerid]) // process.recentmessages will *always* exist. 
            if (process[type] && process[type][wearerid] && process[type][wearerid].keyholder == process.client.user.id) {
                if (type == "collar") { transferCollarKey(wearerid, wearerid) }
                if (type == "chastity") { transferChastityKey(wearerid, wearerid) }
                if (type == "chastitybra") { transferChastityBraKey(wearerid, wearerid) }
            }
            delete process.heldkeytimers[`${wearerid}_${type}`]
        }
    }
}

exports.timelockChastity = timelockChastity;
exports.unlockTimelockChastity = unlockTimelockChastity;

exports.timelockChastityBra = timelockChastityBra;
exports.unlockTimelockChastityBra = unlockTimelockChastityBra;

exports.timelockCollar = timelockCollar;
exports.unlockTimelockCollar = unlockTimelockCollar;

exports.checkGagbotKeys = checkGagbotKeys;