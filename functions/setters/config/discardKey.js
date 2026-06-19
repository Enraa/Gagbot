const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { statsAddCounter } = require("./statsAddCounter");

/*******
 * Discards a key held by keyholderid. Cloned keys are destroyed.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userid - The user wearing the keyed bondage
 * - (user id) keyholderid - The user whose keys are being discarded
 * - (string) device - "collar", "chastity belt", or "chastity bra"
 * ---
 * ##### Returns "keyholder" or "clone", depending on which key was discarded
 *******/
function discardKey(serverID, userid, keyholderid, device) {
    traceFirstParam(arguments[0]);
    // If it isnt one of the three devices we know about, go away
    if ((device != "collar") && (device != "chastity belt") && (device != "chastity bra")) { 
        console.log(`Unknown device ${device}. Use "collar", "chastity belt" or "chastity bra"`)
        return false 
    }
    statsAddCounter(serverID, keyholderid, "fumbledkeys")
    statsAddCounter(serverID, userid, "restraintkeysfumbled")
    let processvar = "collar";
    if (device == "chastity belt") { processvar = "chastity" }
    if (device == "chastity bra") { processvar = "chastitybra" }
    // If this is undefined, we have some big problems lol
    let typelocked = "none";
    if (process[processvar] == undefined) { process[processvar] = {} }
    if (process[processvar][serverID] == undefined) { process[processvar][serverID] = {} }
    if (process[processvar][serverID][userid]) {
        if (process[processvar][serverID][userid].keyholder == keyholderid) {
            // Lost primary keys
            process[processvar][serverID][userid].fumbled = Date.now();
            typelocked = "keyholder";
        }
        else if (process[processvar][serverID][userid].clonedKeyholders.includes(keyholderid)) {
            // Lost a clone. Clones should be destroyed.
            process[processvar][serverID][userid].clonedKeyholders.splice(process[processvar][serverID][userid].clonedKeyholders.indexOf(keyholderid), 1)
            typelocked = "clone";
        }
    }
    markForSave(processvar);
    return typelocked;
}

exports.discardKey = discardKey;