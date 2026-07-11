const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/************
 * Checks whether the keyholder has access to do things to the collaruser. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) collaruser - The User ID who is **wearing** the collar
 * - (user id) keyholder - The User ID who is **performing the action**
 * - (boolean) unlock - If this action involves unlocking and removing the collar
 * - (boolean) cloning - If this action involves creating a secondary access key
 * ---
 * ##### Returns an object { access, public, hascollar } with booleans:
 * - access: Is the keyholder permitted to perform the action?
 * - public: Is this action permitted because of public access?
 * - hascollar: Is the **collaruser** wearing a collar?
 ************/
function canAccessCollar(serverID, collaruser, keyholder, unlock, cloning) {
    traceFirstParam(arguments[0]);
    // As a reference for access in timelocks:
    // 0: "Everyone Else"
    // 1: "Keyholder Only"
    // 2: "Nobody"

    let accessval = { access: false, public: false, hascollar: true };
    // no collar, no need
    if (!getCollar(serverID, collaruser)) {
        accessval.hascollar = false;
        return accessval;
    }
    // Sealed Collar - nobody gets in!
    if (getCollar(serverID, collaruser)?.access == 2) {
        return accessval;
    }
    // If unlock is set, only allow access to unlock if the keyholder is the correct one.
    if (unlock) {
        // Allow unlocks by a non-self keyholder at all times, assuming its not sealed.
        if (getCollar(serverID, collaruser)?.access != 2 && getCollar(serverID, collaruser)?.keyholder == keyholder && keyholder != collaruser && !getCollar(serverID, collaruser)?.fumbled) {
            accessval.access = true;
        }
        // Allow unlocks by any keyholder if no timelock.
        if (getCollar(serverID, collaruser)?.access == undefined && getCollar(serverID, collaruser)?.keyholder == keyholder && !getCollar(serverID, collaruser)?.fumbled) {
            accessval.access = true;
        }
        // Allow unlocks by secondary keyholder if no timelock
        let clonedkeys = getCollar(serverID, collaruser)?.clonedKeyholders ?? [];
        if (getCollar(serverID, collaruser)?.access == undefined && clonedkeys.includes(keyholder)) {
            accessval.access = true;
        }
        // Allow temporary keys to unlock or swap the collar
        if (getCollar(serverID, collaruser)?.temporarykeyholder && (getCollar(serverID, collaruser)?.temporarykeyholder == keyholder) && (getCollar(serverID, collaruser)?.temporarykeyholdertime > Date.now())) {
            accessval.access = true;
        }
        // Else, return false.

        return accessval;
    }
    if (cloning) {
        // Others access only when access is set to 0.
        if (getCollar(serverID, collaruser)?.access == 0 && keyholder != collaruser) {
            accessval.access = true;
            accessval.public = true;
        }
        // Keyholder access if access is unset (no timelocks)
        if (getCollar(serverID, collaruser)?.access == undefined && getCollar(serverID, collaruser)?.keyholder == keyholder && !getCollar(serverID, collaruser)?.fumbled) {
            accessval.access = true;
        }
        // Keyholder access if timelock is 1 (keyholder only) but only if not self.
        if (getCollar(serverID, collaruser)?.access == 1 && getCollar(serverID, collaruser)?.keyholder == keyholder && collaruser != keyholder && !getCollar(serverID, collaruser)?.fumbled) {
            accessval.access = true;
        }

        return accessval;
    }
    // Others access only when access is set to 0.
    if (getCollar(serverID, collaruser)?.access == 0 && keyholder != collaruser) {
        accessval.access = true;
        accessval.public = true;
    }
    // Keyholder access if access is unset (no timelocks)
    if (getCollar(serverID, collaruser)?.access == undefined && getCollar(serverID, collaruser)?.keyholder == keyholder && !getCollar(serverID, collaruser)?.fumbled) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
    let clonedkeys = getCollar(serverID, collaruser)?.clonedKeyholders ?? [];
    if (clonedkeys.includes(keyholder) && getCollar(serverID, collaruser)?.access == undefined) {
        accessval.access = true;
    }
    // Keyholder access if timelock is 1 (keyholder only) but only if not self.
    if (getCollar(serverID, collaruser)?.access == 1 && getCollar(serverID, collaruser)?.keyholder == keyholder && collaruser != keyholder && !getCollar(serverID, collaruser)?.fumbled) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key) if access is 1, but only if not self.
    if (clonedkeys.includes(keyholder) && getCollar(serverID, collaruser)?.access == 1 && collaruser != keyholder) {
        accessval.access = true;
    }
    // Free use collar if not locked.
    if (!getCollar(serverID, collaruser)?.keyholder_only) {
        accessval.access = true;
        accessval.public = true;
    }
    // Free use collar if not locked.
    if (getCollar(serverID, collaruser)?.headpatvulnerable && (getCollar(serverID, collaruser)?.headpatvulnerable >= Date.now())) {
        accessval.access = true;
        accessval.public = true;
    }
    // Keyholder access if temporary keyholder. 
    if (getCollar(serverID, collaruser)?.temporarykeyholder && (getCollar(serverID, collaruser)?.temporarykeyholder == keyholder) && (getCollar(serverID, collaruser)?.temporarykeyholdertime > Date.now())) {
        accessval.access = true;
    }
    // Else, return false.

    return accessval;
}

exports.canAccessCollar = canAccessCollar;