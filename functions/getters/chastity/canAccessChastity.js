const { getChastity } = require("./getChastity");

/************
 * Checks whether the keyholder has access to do things to the chastityuser. 
 * 
 * - (user id) chastityuser - The User ID who is **wearing** the collar
 * - (user id) keyholder - The User ID who is **performing the action**
 * - (boolean) unlock - If this action involves unlocking and removing the collar
 * - (boolean) cloning - If this action involves creating a secondary access key
 * ---
 * ##### Returns an object { access, public, hasbelt } with booleans:
 * - access: Is the keyholder permitted to perform the action?
 * - public: Is this action permitted because of public access?
 * - hasbelt: Is the **chastityuser** wearing a chastity belt?
 ************/
function canAccessChastity(chastityuser, keyholder, unlock, cloning) {
    // As a reference for access in timelocks:
    // 0: "Everyone Else"
    // 1: "Keyholder Only"
    // 2: "Nobody"

    let accessval = { access: false, public: false, hasbelt: true };
    // no belt, no need
    if (!getChastity(chastityuser)) {
        accessval.hasbelt = false;
        return accessval;
    }
    // Sealed Belt - nobody gets in!
    if (getChastity(chastityuser)?.access == 2) {
        return accessval;
    }
    // If unlock is set, only allow access to unlock if the keyholder is the correct one.
    if (unlock) {
        // Allow unlocks by a non-self keyholder at all times, assuming its not sealed.
        if (getChastity(chastityuser)?.access != 2 && getChastity(chastityuser)?.keyholder == keyholder && keyholder != chastityuser && !getChastity(chastityuser)?.fumbled) {
            accessval.access = true;
        }
        // Allow unlocks by any keyholder if no timelock if the key isn't fumbled!
        if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder && !getChastity(chastityuser)?.fumbled) {
            accessval.access = true;
        }
        // Allow unlocks by secondary keyholder if no timelock
        let clonedkeys = getChastity(chastityuser)?.clonedKeyholders ?? [];
        if (getChastity(chastityuser)?.access == undefined && clonedkeys.includes(keyholder)) {
            accessval.access = true;
        }
        // Else, return false.

        return accessval;
    }
    // If Cloning is set, parse specific instructions for that.
    if (cloning) {
        // Primary Keyholder access only if set to 0.
        if (getChastity(chastityuser)?.access == 0 && keyholder != chastityuser) {
            accessval.access = true;
            accessval.public = true;
        }
        // Keyholder access if access is unset (no timelocks) and the key isnt fumbled
        if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder && !getChastity(chastityuser)?.fumbled) {
            accessval.access = true;
        }
        // Keyholder access if timelock is 1 (keyholder only) but only if not self and if key isnt fumbled.
        if (getChastity(chastityuser)?.access == 1 && getChastity(chastityuser)?.keyholder == keyholder && chastityuser != keyholder  && !getChastity(chastityuser)?.fumbled) {
            accessval.access = true;
        }

        return accessval;
    }
    // Others access only when access is set to 0.
    if (getChastity(chastityuser)?.access == 0 && keyholder != chastityuser) {
        accessval.access = true;
        accessval.public = true;
    }
    // Keyholder access if access is unset (no timelocks) and not fumbled
    if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder && !getChastity(chastityuser)?.fumbled) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
    let clonedkeys = getChastity(chastityuser)?.clonedKeyholders ?? [];
    if (clonedkeys.includes(keyholder) && getChastity(chastityuser)?.access == undefined) {
        accessval.access = true;
    }
    // Keyholder access if timelock is 1 (keyholder only) but only if not self and not fumbled
    if (getChastity(chastityuser)?.access == 1 && getChastity(chastityuser)?.keyholder == keyholder && chastityuser != keyholder  && !getChastity(chastityuser)?.fumbled) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key) if access is 1, but only if not self.
    if (clonedkeys.includes(keyholder) && getChastity(chastityuser)?.access == 1 && chastityuser != keyholder) {
        accessval.access = true;
    }
    // Secondary Keyholder access if temporary keyholder. 
    if (getChastity(chastityuser)?.temporarykeyholder && (getChastity(chastityuser)?.temporarykeyholder == keyholder) && (getChastity(chastityuser)?.temporarykeyholdertime > Date.now())) {
        accessval.access = true;
    }

    // Else, return false.

    return accessval;
};

exports.canAccessChastity = canAccessChastity;