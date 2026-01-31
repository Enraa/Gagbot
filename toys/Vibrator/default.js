const { getBaseChastity } = require("../../functions/chastityfunctions")
const { getOption } = require("../../functions/configfunctions")
const { canAccessChastity, addArousal, getChastity } = require("../../functions/vibefunctions")

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

// Condition to check if wearer is wearing a potential blocker
exports.blocker = (data) => { return getChastity(data.userID) }

// Condition to allow modification
exports.canModify = (data) => { return (!canAccessChastity(data.userID, data.keyholderID).hasbelt || canAccessChastity(data.userID, data.keyholderID).access) };

// Condition that rolls a fumble function from the blocking device, returning it's results
// 0 = Success, 1 = Fail, no loss, 2 = Fail, loss
exports.fumble = (data) => {
    return getBaseChastity(getChastity(data.userID).chastitytype).fumble(data);
};

// Discard function if the .fumble causes it
exports.discard = (data) => {
    return getBaseChastity(getChastity(data.userID).chastitytype).discard(data);
}

// Action when equipping
exports.onEquip = (data) => { addArousal(data.userID, data.intensity / 2) };

// Calculation for effective arousal
// Note, this should be used for checks more focused around the vibe - it will be
// further multiplied by the chastity's checks for this, if applicable. 
exports.calcVibeEffect = function (data) { 
    return data.intensity * this.vibescale()
}

// Name for the toy!
exports.toyname = "Default Vibrator"

// Category Name for the toy
exports.category = "Vibrator"