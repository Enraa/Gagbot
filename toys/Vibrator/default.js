const { getOption } = require("../../functions/configfunctions")
const { rollKeyFumble } = require("../../functions/keyfindingfunctions")
const { canAccessChastity, addArousal, discardChastityKey } = require("../../functions/vibefunctions")

// These values are used whenever they're unspecified on the vibe in this folder.
// Arousal gain per intensity for this vibe type
exports.vibescale = (data) => { return 0.6 }

// Intensity change for this vibe type
exports.intensitychange = (data) => { return 0 }

// Post Letgo
exports.postLetGo = (data) => { return false }

// Condition for allowing equip
exports.canEquip = (data) => { return (!canAccessChastity(data.userID, data.keyholderID).hasbelt || canAccessChastity(data.userID, data.keyholderID).access) }

// Condition for allowing unequip
exports.canUnequip = (data) => { return (!canAccessChastity(data.userID, data.keyholderID).hasbelt || canAccessChastity(data.userID, data.keyholderID).access) }

// Condition to force unequip on refresh
exports.forceUnequip = (data) => { return false }

// Condition to allow modification
exports.canModify = (data) => { return (!canAccessChastity(data.userID, data.keyholderID).hasbelt || canAccessChastity(data.userID, data.keyholderID).access) };

// Condition that rolls a fumble function, returning it's results
// 0 = Success, 1 = Fail, no loss, 2 = Fail, loss
exports.fumble = (data) => {
    if (getOption(data.userID, "fumbling") == "disabled") { return 0 }
    let fumble = rollKeyFumble(data.keyholderID, data.userID);
    if (fumble > 1 && (getOption(data.userID, "keyloss") == "disabled")) {
        fumble = 1; // force it back to a no key loss
    }
    return fumble;
};

// Discard function if the .fumble causes it
exports.discard = (data) => {
    return discardChastityKey(data.userID, data.keyholderID);
}

// Action when equipping
exports.onEquip = (data) => { addArousal(data.userID, data.intensity / 2) };

// Calculation for effective arousal
// Note, this should be used for checks more focused around the vibe - it will be
// further multiplied by the chastity's checks for this, if applicable. 
exports.calcVibeEffect = function (data) { return data.intensity * this.vibescale }

// Name for the toy!
exports.toyname = "Default Vibrator"

// Category Name for the toy
exports.category = "Vibrator"