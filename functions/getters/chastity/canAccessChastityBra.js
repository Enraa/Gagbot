const { getChastityBra } = require("./getChastityBra");

/************
 * Checks whether the keyholder has access to do things to the chastityuser. (for chastity bra)
 * 
 * - (user id) chastityuser - The User ID who is **wearing** the collar
 * - (user id) keyholder - The User ID who is **performing the action**
 * - (boolean) unlock - If this action involves unlocking and removing the collar
 * - (boolean) cloning - If this action involves creating a secondary access key
 * ---
 * ##### Returns an object { access, public, hasbelt } with booleans:
 * - access: Is the keyholder permitted to perform the action?
 * - public: Is this action permitted because of public access?
 * - hasbelt: Is the **chastityuser** wearing a chastity bra?
 ************/
function canAccessChastityBra(chastityuser, keyholder, unlock, cloning) {
    // As a reference for access in timelocks:
    // 0: "Everyone Else"
    // 1: "Keyholder Only"
    // 2: "Nobody"

    let accessval = { access: false, public: false, hasbelt: true };
    // no belt, no need
    if (!getChastityBra(chastityuser)) {
        accessval.hasbelt = false;
        return accessval;
    }
    // Sealed Belt - nobody gets in!
    if (getChastityBra(chastityuser)?.access == 2) {
        return accessval;
    }
    // If unlock is set, only allow access to unlock if the keyholder is the correct one.
    if (unlock) {
        // Allow unlocks by a non-self keyholder at all times, assuming its not sealed.
        if (getChastityBra(chastityuser)?.access != 2 && getChastityBra(chastityuser)?.keyholder == keyholder && keyholder != chastityuser && !getChastityBra(chastityuser)?.fumbled) {
            accessval.access = true;
        }
        // Allow unlocks by any keyholder if no timelock and not fumbled.
        if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder && !getChastityBra(chastityuser)?.fumbled) {
            accessval.access = true;
        }
        // Allow unlocks by secondary keyholder if no timelock
        let clonedkeys = getChastityBra(chastityuser)?.clonedKeyholders ?? [];
        if (getChastityBra(chastityuser)?.access == undefined && clonedkeys.includes(keyholder)) {
            accessval.access = true;
        }
        // Else, return false.

        return accessval;
    }
    // If Cloning is set, parse specific instructions for that.
    if (cloning) {
        // Primary Keyholder access only if set to 0.
        if (getChastityBra(chastityuser)?.access == 0 && keyholder != chastityuser) {
            accessval.access = true;
            accessval.public = true;
        }
        // Keyholder access if access is unset (no timelocks)
        if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder && !getChastityBra(chastityuser)?.fumbled) {
            accessval.access = true;
        }
        // Keyholder access if timelock is 1 (keyholder only) but only if not self.
        if (getChastityBra(chastityuser)?.access == 1 && getChastityBra(chastityuser)?.keyholder == keyholder && chastityuser != keyholder && !getChastityBra(chastityuser)?.fumbled) {
            accessval.access = true;
        }

        return accessval;
    }
    // Others access only when access is set to 0.
    if (getChastityBra(chastityuser)?.access == 0 && keyholder != chastityuser) {
        accessval.access = true;
        accessval.public = true;
    }
    // Keyholder access if access is unset (no timelocks)
    if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder && !getChastityBra(chastityuser)?.fumbled) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
    let clonedkeys = getChastityBra(chastityuser)?.clonedKeyholders ?? [];
    if (clonedkeys.includes(keyholder) && getChastityBra(chastityuser)?.access == undefined) {
        accessval.access = true;
    }
    // Keyholder access if timelock is 1 (keyholder only) but only if not self.
    if (getChastityBra(chastityuser)?.access == 1 && getChastityBra(chastityuser)?.keyholder == keyholder && chastityuser != keyholder && !getChastityBra(chastityuser)?.fumbled) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key) if access is 1, but only if not self.
    if (clonedkeys.includes(keyholder) && getChastityBra(chastityuser)?.access == 1 && chastityuser != keyholder) {
        accessval.access = true;
    }
    // Keyholder access if temporary keyholder. 
    if (getChastityBra(chastityuser)?.temporarykeyholder && (getChastityBra(chastityuser)?.temporarykeyholder == keyholder) && (getChastityBra(chastityuser)?.temporarykeyholdertime > Date.now())) {
        accessval.access = true;
    }
    // Else, return false.

    return accessval;
};

exports.canAccessChastityBra = canAccessChastityBra;