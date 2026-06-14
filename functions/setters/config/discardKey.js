const { statsAddCounter } = require("./statsAddCounter");

/*******
 * Discards a key held by keyholderid. Cloned keys are destroyed.
 * 
 * - (user id) userid - The user wearing the keyed bondage
 * - (user id) keyholderid - The user whose keys are being discarded
 * - (string) device - "collar", "chastity belt", or "chastity bra"
 * ---
 * ##### Returns "keyholder" or "clone", depending on which key was discarded
 *******/
function discardKey(userid, keyholderid, device) {
    // If it isnt one of the three devices we know about, go away
    if ((device != "collar") && (device != "chastity belt") && (device != "chastity bra")) { 
        console.log(`Unknown device ${device}. Use "collar", "chastity belt" or "chastity bra"`)
        return false 
    }
    statsAddCounter(keyholderid, "fumbledkeys")
    statsAddCounter(userid, "restraintkeysfumbled")
    let processvar = "collar";
    if (device == "chastity belt") { processvar = "chastity" }
    if (device == "chastity bra") { processvar = "chastitybra" }
    // If this is undefined, we have some big problems lol
    let typelocked = "none";
    if (process[processvar] == undefined) { process[processvar] = {} }
    if (process[processvar][userid]) {
        if (process[processvar][userid].keyholder == keyholderid) {
            // Lost primary keys
            process[processvar][userid].fumbled = Date.now();
            typelocked = "keyholder";
        }
        else if (process[processvar][userid].clonedKeyholders.includes(keyholderid)) {
            // Lost a clone. Clones should be destroyed.
            process[processvar][userid].clonedKeyholders.splice(process[processvar][userid].clonedKeyholders.indexOf(keyholderid), 1)
            typelocked = "clone";
        }
    }
    if (process.readytosave == undefined) {
		process.readytosave = {};
	}
    process.readytosave[processvar] = true;
    return typelocked;
}

exports.discardKey = discardKey;