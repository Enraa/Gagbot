const { getBaseChastity } = require("../../functions/chastityfunctions")
const { getOption } = require("../../functions/configfunctions")
const { rollKeyFumble } = require("../../functions/keyfindingfunctions")
const { getChastityBra, addArousal } = require("../../functions/vibefunctions")
const { discardChastityBraKey } = require("../../functions/vibefunctions")
const { canAccessChastityBra } = require("../../functions/vibefunctions")

// These values are used whenever they're unspecified on the vibe in this folder.
// Arousal gain per intensity for this vibe type
exports.vibescale = (data) => { return 0.3 }

// Intensity change for this vibe type
exports.intensitychange = (data) => { return 0 }

// Post Letgo
exports.postLetGo = (data) => { return false }

// Condition for allowing equip
exports.canEquip = (data) => { return (!canAccessChastityBra(data.userID, data.keyholderID).hasbelt || canAccessChastityBra(data.userID, data.keyholderID).access) }

// Condition for allowing unequip
exports.canUnequip = (data) => { return (!canAccessChastityBra(data.userID, data.keyholderID).hasbelt || canAccessChastityBra(data.userID, data.keyholderID).access) }

// Condition to force unequip on refresh
exports.forceUnequip = (data) => { return false }

// Condition to check if wearer is wearing a potential blocker
exports.blocker = (data) => { return getChastityBra(data.userID) }

// Condition to allow modification
exports.canModify = (data) => { return (!canAccessChastityBra(data.userID, data.keyholderID).hasbelt || canAccessChastityBra(data.userID, data.keyholderID).access) };

// Condition that rolls a fumble function, returning it's results
// 0 = Success, 1 = Fail, no loss, 2 = Fail, loss
exports.fumble = (data) => {
    return getBaseChastity(getChastityBra(data.userID).chastitytype).fumble(data);
};

// Discard function if the .fumble causes it
exports.discard = (data) => {
    return getBaseChastity(getChastityBra(data.userID).chastitytype).discard(data);
};

// Action when equipping
exports.onEquip = (data) => { addArousal(data.userID, data.intensity / 4) };

// Calculation for effective arousal
// Note, this should be used for checks more focused around the vibe - it will be
// further multiplied by the chastity's checks for this, if applicable. 
exports.calcVibeEffect = function (data) { return data.intensity * this.vibescale() }

// Name for the toy!
exports.toyname = "Default Nipple Vibrator"

// Category Name for the toy
exports.category = "Nipple Vibrator"