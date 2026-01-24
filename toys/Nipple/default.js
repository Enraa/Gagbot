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

// Calculation for effective arousal
// Note, this should be used for checks more focused around the vibe - it will be
// further multiplied by the chastity's checks for this, if applicable. 
exports.calcArousal = function (data) { return data.intensity * this.vibescale }

// Name for the toy!
exports.toyname = "Default Nipple Vibrator"

// Category Name for the toy
exports.category = "Nipple Vibrator"